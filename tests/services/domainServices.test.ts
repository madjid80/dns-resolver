import { extractDomainHost, lookupDomainHost } from '../../src/services/domainServices';
import { logger } from '../../src/utils/logger';
import sinon from 'sinon';
import * as dnsPromises from 'node:dns/promises';

describe('domain services', () => {
  describe('extractDomainHost', () => {
    let loggerErrorSpy: sinon.SinonSpy;
    let loggerInfoSpy: sinon.SinonSpy;

    beforeEach(() => {
      loggerErrorSpy = sinon.spy(logger, 'error');
      loggerInfoSpy = sinon.spy(logger, 'info');
    });

    afterEach(() => {
      loggerErrorSpy.restore();
      loggerInfoSpy.restore();
    });

    it('should return the extracted domain from a valid input', () => {
      const requestedDomain = 'www.example.com';
      const parsedDomain = 'example.com';

      const result = extractDomainHost(requestedDomain);

      expect(result).toEqual(parsedDomain);
      expect(loggerInfoSpy.calledWith('extracted domain part is: ', parsedDomain)).toBe(true);
      expect(loggerErrorSpy.called).toBe(false);
    });

    it('should throw an error for an invalid input', () => {
      const requestedDomain = 'not a valid domain';
      const errorMessage = 'Please send correct domain format.';

      expect(() => extractDomainHost(requestedDomain)).toThrow(errorMessage);
      expect(loggerErrorSpy.calledWith(`${requestedDomain} is not a correct format and regex result is false`)).toBe(
        true
      );
      expect(loggerInfoSpy.called).toBe(false);
    });
  });
});
