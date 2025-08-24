import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class TimezoneService {
  async getCurrentTimeInTimezone(timezone: string = 'UTC'): Promise<string> {
    return moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  }

  async convertTime(
    date: Date | string,
    fromTimezone: string,
    toTimezone: string,
  ): Promise<string> {
    return moment.tz(date, fromTimezone).tz(toTimezone).format('YYYY-MM-DD HH:mm:ss');
  }

  async formatDate(
    date: Date | string,
    format: string = 'YYYY-MM-DD HH:mm:ss',
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).format(format);
  }

  async addDays(
    date: Date | string,
    days: number,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  async subtractDays(
    date: Date | string,
    days: number,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  async getTimeDifference(
    date1: Date | string,
    date2: Date | string,
    unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days',
  ): Promise<number> {
    return moment(date1).diff(moment(date2), unit);
  }

  async isDateInPast(date: Date | string): Promise<boolean> {
    return moment(date).isBefore(moment());
  }

  async isDateInFuture(date: Date | string): Promise<boolean> {
    return moment(date).isAfter(moment());
  }

  async getAvailableTimezones(): Promise<string[]> {
    return moment.tz.names();
  }

  async getTimezoneOffset(timezone: string): Promise<number> {
    return moment().tz(timezone).utcOffset();
  }

  async parseDate(
    dateString: string,
    format: string = 'YYYY-MM-DD HH:mm:ss',
    timezone: string = 'UTC',
  ): Promise<Date> {
    return moment.tz(dateString, format, timezone).toDate();
  }

  async isValidDate(date: string, format?: string): Promise<boolean> {
    return moment(date, format).isValid();
  }

  async getStartOfDay(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  }

  async getEndOfDay(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).endOf('day').format('YYYY-MM-DD HH:mm:ss');
  }

  async getStartOfWeek(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).startOf('week').format('YYYY-MM-DD HH:mm:ss');
  }

  async getEndOfWeek(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).endOf('week').format('YYYY-MM-DD HH:mm:ss');
  }

  async getStartOfMonth(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  }

  async getEndOfMonth(
    date: Date | string,
    timezone: string = 'UTC',
  ): Promise<string> {
    return moment(date).tz(timezone).endOf('month').format('YYYY-MM-DD HH:mm:ss');
  }
}
