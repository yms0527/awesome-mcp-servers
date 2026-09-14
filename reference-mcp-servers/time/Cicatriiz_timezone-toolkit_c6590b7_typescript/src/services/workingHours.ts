/**
 * Working Hours Overlap Service
 *
 * Provides functionality for calculating business hours overlap
 * between teams in different timezones.
 */

import { DateTime, Interval } from 'luxon';
import { WorkingHoursRequest, WorkingHoursResponse } from '../types/index.js';
import { getSystemTimezone, isValidTimezone } from '../utils/dateTimeUtils.js';

/**
 * Calculates working hours overlap between teams in different timezones
 */
export async function calculateWorkingHoursOverlap(teams: any[], userTimezone?: string): Promise<string> {
  // Validate teams
  if (!teams || teams.length === 0) {
    throw new Error('At least one team is required');
  }

  // Use system timezone if not provided
  if (!userTimezone) {
    userTimezone = getSystemTimezone();
  }

  // Validate timezones
  if (!isValidTimezone(userTimezone)) {
    throw new Error(`Invalid user timezone: ${userTimezone}`);
  }

  for (const team of teams) {
    if (!isValidTimezone(team.timezone)) {
      throw new Error(`Invalid timezone for team ${team.name}: ${team.timezone}`);
    }
  }

  // Get today's date
  const today = DateTime.now().setZone(userTimezone).startOf('day');

  // Calculate working hours intervals for each team
  const workingHoursIntervals = teams.map(team => {
    // Parse working hours
    const [startHour, startMinute] = team.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = team.workingHours.end.split(':').map(Number);

    // Create DateTime objects in the team's timezone
    const teamToday = today.setZone(team.timezone);
    const workStart = teamToday.set({ hour: startHour, minute: startMinute });
    const workEnd = teamToday.set({ hour: endHour, minute: endMinute });

    return {
      team,
      interval: Interval.fromDateTimes(workStart, workEnd)
    };
  });

  // Convert working hours to user's timezone
  const teamsInUserTimezone = teams.map((team, index) => {
    const interval = workingHoursIntervals[index].interval;

    // Convert to user timezone
    const startInUserTz = interval.start!.setZone(userTimezone!);
    const endInUserTz = interval.end!.setZone(userTimezone!);

    return {
      name: team.name,
      timezone: team.timezone,
      workingHoursInUserTimezone: {
        start: startInUserTz.toLocaleString(DateTime.TIME_SIMPLE),
        end: endInUserTz.toLocaleString(DateTime.TIME_SIMPLE)
      }
    };
  });

  // Calculate overlap periods
  const overlapPeriods = [];

  // For each pair of teams
  for (let i = 0; i < workingHoursIntervals.length; i++) {
    for (let j = i + 1; j < workingHoursIntervals.length; j++) {
      const team1 = workingHoursIntervals[i];
      const team2 = workingHoursIntervals[j];

      // Check if there's an overlap
      if (team1.interval.overlaps(team2.interval)) {
        // Calculate the overlap interval
        const overlapInterval = team1.interval.intersection(team2.interval);

        if (overlapInterval) {
          // Convert to user timezone
          const startInUserTz = overlapInterval.start!.setZone(userTimezone!);
          const endInUserTz = overlapInterval.end!.setZone(userTimezone!);

          // Calculate duration in minutes
          const durationMinutes = overlapInterval.length('minutes');

          overlapPeriods.push({
            teams: [team1.team.name, team2.team.name],
            startTime: startInUserTz.toISO() || '',
            endTime: endInUserTz.toISO() || '',
            durationMinutes
          });
        }
      }
    }
  }

  // Calculate overlap for all teams if there are more than 2
  if (workingHoursIntervals.length > 2) {
    let allTeamsOverlap = workingHoursIntervals[0].interval;
    let hasOverlap = true;

    // Find the intersection of all intervals
    for (let i = 1; i < workingHoursIntervals.length; i++) {
      const intersection = allTeamsOverlap.intersection(workingHoursIntervals[i].interval);

      if (!intersection) {
        hasOverlap = false;
        break;
      }

      allTeamsOverlap = intersection;
    }

    if (hasOverlap) {
      // Convert to user timezone
      const startInUserTz = allTeamsOverlap.start!.setZone(userTimezone!);
      const endInUserTz = allTeamsOverlap.end!.setZone(userTimezone!);

      // Calculate duration in minutes
      const durationMinutes = allTeamsOverlap.length('minutes');

      overlapPeriods.push({
        teams: teams.map(team => team.name),
        startTime: startInUserTz.toISO() || '',
        endTime: endInUserTz.toISO() || '',
        durationMinutes
      });
    }
  }

  const result = {
    teams: teamsInUserTimezone,
    overlapPeriods,
    userTimezone
  };

  return JSON.stringify(result, null, 2);
}
