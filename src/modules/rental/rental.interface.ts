import { RentalStatus } from "../../../generated/prisma/enums.js";

export interface ICreateRental {
  gearId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface IUpdateRentalStatus {
  status: RentalStatus;
}
