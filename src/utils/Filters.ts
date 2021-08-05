import { isAfter, isBefore, isEqual } from 'date-fns';
import { IActivity } from '../models/Activity';

export class ActivityFilters {
  // tslint:disable-next-line: no-empty
  public constructor() {}

  /**
   * Filter activities by Start Time
   * @param activities Array of activities
   * @param params Query parameters
   * @param option True = ifAfter | False = ifBefore
   * @returns Array of Activities filtered by start time or end time
   */
  public filterActivitiesByStartTime(
    activities: string[],
    startTime: string,
    option: boolean
  ): string[] {
    const activityArray: string[] = [];
    activities.forEach((element: any) => {
      switch (option) {
        case true:
          if (isAfter(element.startTime, startTime) || isEqual(element.startTime, startTime)) {
            activityArray.push(element);
          }
          break;
        case false:
          if (isBefore(element.startTime, startTime) || isEqual(element.startTime, startTime)) {
            activityArray.push(element);
          }
      }
    });
    return activityArray;
  }

  /**
   * Filter activities by parameter
   * @param activities Array of activities
   * @param value Value of the @param field
   * @param field activityType | testStationPNumber | testerStaffId
   * @returns Array of Activities filtered by activityType | testStationPNumber | testerStaffId
   */
  public filterActivitiesByParameter(activities: string[], value: string | null, field: string) {
    const filteredArrayOfActivities = activities.filter((element: any) => {
      return element[field] === value;
    });
    return filteredArrayOfActivities;
  }

  /**
   * Order Activities desc by Start Time
   * @param activities Array of activities
   * @returns Array of Activities ordered desc
   */
  public returnOrderedActivities(activities: IActivity[]): IActivity[] {
    const sortDateDesc = (activity1: IActivity, activity2: IActivity) => {
      const date = new Date(activity1.startTime as string).toISOString();
      const dateToCompare = new Date(activity2.startTime as string).toISOString();
      if (date > dateToCompare) {
        return -1;
      }
      if (date < dateToCompare) {
        return 1;
      }
      return 0;
    };
    activities.sort(sortDateDesc);
    const { length } = activities;
    activities.length = length <= 10 ? length : 10;
    return activities;
  }
}
