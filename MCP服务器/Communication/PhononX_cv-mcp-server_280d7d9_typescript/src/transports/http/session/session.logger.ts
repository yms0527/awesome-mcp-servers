import { SessionMetrics } from './session.types';

import { logger } from '../../../utils';

export class SessionLogger {
  logSessionCreated(): void {
    logger.info('🆕 Session created', {
      event: 'SESSION_CREATED',
    });
  }

  logSessionDestroyed(duration: number, metrics: SessionMetrics): void {
    logger.info('🗑️ Session destroyed', {
      duration,
      metrics,
      event: 'SESSION_DESTROYED',
    });
  }

  logSessionTimeout(): void {
    logger.info('⏰ Session timeout triggered', {
      event: 'SESSION_TIMEOUT',
    });
  }

  logSessionReused(totalInteractions: number): void {
    logger.debug('🔄 Session reused', {
      totalInteractions,
      event: 'SESSION_REUSED',
    });
  }

  logSessionError(error: Error, context?: Record<string, unknown>): void {
    logger.error('❌ Session error', {
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      context,
      event: 'SESSION_ERROR',
    });
  }

  logSessionDebug(message: string, context?: Record<string, unknown>): void {
    logger.debug('🔍 Session debug', {
      message,
      context,
      event: 'SESSION_DEBUG',
    });
  }

  logSessionMetrics(metrics: SessionMetrics): void {
    logger.debug('📊 Session metrics', {
      metrics,
      event: 'SESSION_METRICS',
    });
  }

  logCleanupStarted(totalSessions: number): void {
    logger.info('🧹 Session cleanup started', {
      totalSessions,
      event: 'SESSION_CLEANUP_STARTED',
    });
  }

  logCleanupCompleted(
    cleanedSessions: number,
    remainingSessions: number,
  ): void {
    logger.info('✨ Session cleanup completed', {
      cleanedSessions,
      remainingSessions,
      event: 'SESSION_CLEANUP_COMPLETED',
    });
  }
}
