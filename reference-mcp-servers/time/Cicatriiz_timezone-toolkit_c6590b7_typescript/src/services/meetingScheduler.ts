/**
 * Meeting Scheduler Service
 *
 * Provides functionality for finding optimal meeting times
 * across multiple timezones.
 */

import { DateTime, Interval } from 'luxon';
import {
  MeetingSchedulerRequest,
  MeetingSchedulerResponse,
  Participant,
  TimeSlot
} from '../types/index.js';
import { parseTime, isValidTimezone } from '../utils/dateTimeUtils.js';

/**
 * Finds optimal meeting times across multiple timezones
 */
export async function findMeetingTimes(participants: Participant[], date?: string, duration: number = 60, startHour: number = 9, endHour: number = 17): Promise<string> {
  // Validate participants
  if (!participants || participants.length === 0) {
    throw new Error('At least one participant is required');
  }

  // Validate timezones
  for (const participant of participants) {
    if (!isValidTimezone(participant.timezone)) {
      throw new Error(`Invalid timezone for ${participant.name}: ${participant.timezone}`);
    }
  }

  // Validate hours
  if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23 || startHour >= endHour) {
    throw new Error('Invalid start or end hour. Hours must be between 0-23 and start hour must be less than end hour.');
  }

  // Parse the input date (use the first participant's timezone as reference)
  const referenceTimezone = participants[0].timezone;
  const meetingDate = parseTime(date, referenceTimezone).startOf('day');

  // Calculate working hours intervals for each participant
  const workingHoursIntervals = participants.map(participant => {
    const participantDate = meetingDate.setZone(participant.timezone);

    const workStart = participantDate.set({ hour: startHour, minute: 0 });
    const workEnd = participantDate.set({ hour: endHour, minute: 0 });

    return {
      participant,
      interval: Interval.fromDateTimes(workStart, workEnd)
    };
  });

  // Find common time slots
  const timeSlots: TimeSlot[] = [];
  const slotDurationMillis = duration * 60 * 1000;

  // Use the reference timezone for iteration
  const dayStart = meetingDate.set({ hour: 0, minute: 0 });
  const dayEnd = meetingDate.set({ hour: 23, minute: 59 });

  // Iterate in 30-minute increments
  let currentTime = dayStart;
  while (currentTime < dayEnd) {
    const slotEnd = currentTime.plus({ milliseconds: slotDurationMillis });
    const currentSlot = Interval.fromDateTimes(currentTime, slotEnd);

    // Check if this slot works for all participants
    const isValidForAll = workingHoursIntervals.every(({ interval }) => {
      return currentSlot.overlaps(interval);
    });

    if (isValidForAll) {
      // Create a time slot
      const timeSlot: TimeSlot = {
        startTime: currentTime.toISO() || '',
        endTime: slotEnd.toISO() || '',
        participantTimes: participants.map(participant => {
          const localStart = currentTime.setZone(participant.timezone);
          const localEnd = slotEnd.setZone(participant.timezone);

          return {
            name: participant.name,
            timezone: participant.timezone,
            localStartTime: localStart.toLocaleString(DateTime.TIME_SIMPLE),
            localEndTime: localEnd.toLocaleString(DateTime.TIME_SIMPLE)
          };
        })
      };

      timeSlots.push(timeSlot);
    }

    // Move to the next 30-minute slot
    currentTime = currentTime.plus({ minutes: 30 });
  }

  // Find the optimal time slot (middle of the working day for most participants)
  let optimalTimeSlot: TimeSlot | undefined;

  if (timeSlots.length > 0) {
    // Calculate a score for each time slot based on how close it is to the middle of the working day
    const scoredSlots = timeSlots.map(slot => {
      let totalScore = 0;

      for (const participantTime of slot.participantTimes) {
        const startTime = DateTime.fromFormat(participantTime.localStartTime, 'h:mm a', { zone: participantTime.timezone });
        const midWorkingDay = DateTime.fromObject(
          { hour: (startHour + endHour) / 2 },
          { zone: participantTime.timezone }
        );

        // Calculate how close this time is to the middle of the working day
        const diffHours = Math.abs(startTime.hour - midWorkingDay.hour);
        // Lower score is better (closer to middle of day)
        totalScore += diffHours;
      }

      return { slot, score: totalScore };
    });

    // Sort by score (lowest first)
    scoredSlots.sort((a, b) => a.score - b.score);

    // The optimal slot is the one with the lowest score
    optimalTimeSlot = scoredSlots[0].slot;
  }

  const result = {
    date: meetingDate.toISODate() || '',
    suggestedTimeSlots: timeSlots,
    optimalTimeSlot
  };

  return JSON.stringify(result, null, 2);
}
