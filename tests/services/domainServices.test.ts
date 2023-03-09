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

  describe('lookupDomainHost', () => {
    let loggerInfoSpy: sinon.SinonSpy;
    let dnsLookupStub: sinon.SinonStub;

    beforeEach(() => {
      loggerInfoSpy = sinon.spy(logger, 'info');
      dnsLookupStub = sinon.stub(dnsPromises, 'lookup');
    });

    afterEach(() => {
      loggerInfoSpy.restore();
      dnsLookupStub.restore();
    });

    it('should return the IP address and domain for a valid input', async () => {
      const domain = 'www.example.com';
      const ipAddress = '192.0.2.1';
      dnsLookupStub.withArgs(domain, 4).resolves({ address: ipAddress });

      const result = await lookupDomainHost(domain);

      expect(result).toEqual({ ip: ipAddress, domain });
      expect(loggerInfoSpy.calledWith('Address for extracted domain is: ', { address: ipAddress })).toBe(true);
    });

    it('should throw an error for an invalid input', async () => {
      const domain = 'not-a-valid-domain';
      const errorMessage = 'getaddrinfo ENOTFOUND not-a-valid-domain';
      dnsLookupStub.withArgs(domain, 4).rejects(new Error(errorMessage));

      await expect(lookupDomainHost(domain)).rejects.toThrow(errorMessage);
      expect(loggerInfoSpy.called).toBe(false);
    });
  });
});
