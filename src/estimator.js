const covid19ImpactEstimator = (data) => { 

  if (data.periodType === 'months') data.timeToElapse *= 30;
  if (data.periodType === 'weeks') data.timeToElapse *= 7;
  let severeImpact = {};
  let impact = {};
  let estimation = {};
  let capacity = 0.35;

  let currentMixim = obj=> obj.currentlyInfected = data.reportedCases * 10;
  currentMixim(impact);

  let severeCurrentMixim = obj=> obj.currentlyInfected = data.reportedCases * 50;
  severeCurrentMixim(severeImpact);

  let factor = Math.floor(data.timeToElapse / 3);

  let infectMixin = (obj) =>
    (obj.infectionsByRequestedTime = obj.currentlyInfected * (2 ** factor));
  infectMixin(impact);
  infectMixin(severeImpact);

  let severeMixin = (obj) =>
    (obj.severeCasesByRequestedTime = 0.15 * obj.infectionsByRequestedTime);
  let bedMixin = (obj) =>
    (obj.hospitalBedsByRequestedTime = capacity * obj.totalHospitalBeds);
  let ICUMixin = (obj) =>
    (obj.casesForICUByRequestedTime = 0.05 * obj.infectionsByRequestedTime);
    
  let ACMixin = (obj) =>
    (obj.casesForVentilatorsByRequestedTime = 0.02 * obj.infectionsByRequestedTime);
    
  let AC2Mixin = (obj) =>
    (obj.dollarsInFlight = obj.infectionsByRequestedTime * obj.region.avgDailyIncomePopulation * obj.region.avgDailyIncomeInUSD * obj.timeToElapse);
    
    obj.hospitalBedsByRequestedTime>0?obj.hospitalBedsByRequestedTime:-1*obj.severeCasesByRequestedTime;

    return {
      data, 
      impact, 
      severeImpact 
    };
};

export default covid19ImpactEstimator;
