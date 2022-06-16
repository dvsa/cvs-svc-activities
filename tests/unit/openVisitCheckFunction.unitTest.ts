import { openVisitCheck } from '../../src/functions/openVisitCheck';
import { Context } from 'aws-lambda';
import OpenVisitService from '../../src/services/OpenVisitService';
import { HTTPRESPONSE } from '../../src/assets/enums';

describe('openVisitCheck Function', () => {
  // @ts-ignore
  const ctx: Context = null;
  describe('without staffId query param', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {}
      };
      try {
         openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(JSON.stringify(HTTPRESPONSE.BAD_REQUEST));
      }
    });
  });
  describe('with staffId query param that is empty string', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {
          testerStaffId: ' '
        }
      };

      try {
        await openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(HTTPRESPONSE.MISSING_PARAMETERS);
      }
    });
  });
  describe('with staffId query param that is the string "undefined"', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {
          testerStaffId: 'undefined'
        }
      };

      try {
        await openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(HTTPRESPONSE.MISSING_PARAMETERS);
      }
    });
  });
  describe('with staffId query param that is the string "null"', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {
          testerStaffId: 'null'
        }
      };

      try{
        await openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(HTTPRESPONSE.MISSING_PARAMETERS);
      }
    });
  });
  describe('with staffId query param that is undefined', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {
          testerStaffId: undefined
        }
      };

      try{
        await openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(HTTPRESPONSE.MISSING_PARAMETERS);
      }
    });
  });
  describe('with staffId query param that is null', () => {
    it('return BAD REQUEST error', async () => {
      const event = {
        queryStringParameters: {
          testerStaffId: null
        }
      };

      try{
        await openVisitCheck(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect.assertions(2);
        expect(e.statusCode).toEqual(400);
        expect(e.body).toEqual(HTTPRESPONSE.MISSING_PARAMETERS);
      }
    });
  });
  describe('with staffId query param', () => {
    describe('and with a successful return from the Service call', () => {
      it('returns 200 and the data from the service call', async () => {
        const event = {
          queryStringParameters: {
            testerStaffId: 'anything'
          }
        };
        jest.spyOn(OpenVisitService.prototype, 'checkOpenVisit').mockResolvedValue(true);
        try {
          await openVisitCheck(event, ctx, () => {
            return;
          });
        } catch (e) {
          expect.assertions(2);
          expect(e.statusCode).toEqual(200);
          expect(e.body).toEqual(JSON.stringify(true));
        }
      });
    });
    describe('and with a error returned from the Service call', () => {
      it('returns the error', async () => {
        const event = {
          queryStringParameters: {
            testerStaffId: 'anything'
          }
        };
        try {
          await openVisitCheck(event, ctx, () => {
            return;
          });
        } catch (e) {
          expect.assertions(2);
          expect(e.statusCode).toEqual(418);
          expect(e.body).toEqual(JSON.stringify('Warning, Will Robinson!'));
        }
      });
    });
  });
});
