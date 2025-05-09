import OZMapSDK from '@ozmap/ozmap-sdk';
import {BoxTypeOzmapSource} from '../../../../src/infrastructure/datasources/box/BoxTypeOzmapSource';

describe('BoxTypeOzmapSource', () => {

  describe('getData', () => {

    it('should fetch box types from Ozmap API', async () => {
      
      const sdk = new OZMapSDK('',{apiKey:'aa'}); 
      
      const boxTypeSource = new BoxTypeOzmapSource(sdk);

      const result = await boxTypeSource.getData();
      
      expect(result.length > 0).toBe(true);
      
    });
  });

});