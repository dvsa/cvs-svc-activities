import { ActivityType, TestStationTypes, WaitReason } from '@dvsa/cvs-type-definitions/types/v1/activity';

export const waitReasons: string[] = [
  WaitReason.WAITING_FOR_VEHICLE,
  WaitReason.BREAK,
  WaitReason.ADMIN,
  WaitReason.SITE_ISSUE,
  WaitReason.OTHER
];
export const stationTypes: string[] = [
  TestStationTypes.ATF,
  TestStationTypes.GVTS,
  TestStationTypes.HQ,
  TestStationTypes.POTF
];
export const activitiesTypes: string[] = [
  ActivityType.VISIT,
  ActivityType.WAIT,
  ActivityType.UNACCOUNTABLE_TIME
];

export interface IActivityParams {
  fromStartTime: string;
  toStartTime: string;
  activityType?: string;
  testStationPNumber?: string;
  testerStaffId?: string;
  isOpen?: boolean;
}
