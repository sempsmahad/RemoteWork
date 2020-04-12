const covid19ImpactEstimator = (data) => {
  if (data.periodType === 'months') data.timeToElapse *= 30;
  if (data.periodType === 'weeks') data.timeToElapse *= 7;
  const severeImpact = {};
  const impact = {};
  // const estimation = {};
  const capacity = 0.35;

  const currentMixim = (obj) => {
    obj.currentlyInfected = data.reportedCases * 10;
  };
  currentMixim(impact);

  const severeCurrentMixim = (obj) => {
    obj.currentlyInfected = data.reportedCases * 50;
    return false;
  };

  severeCurrentMixim(severeImpact);

  const factor = Math.floor(data.timeToElapse / 3);

  const infectMixin = (obj) => {
    obj.infectionsByRequestedTime = obj.currentlyInfected * 2 ** factor;
    return false;
  };

  infectMixin(impact);
  infectMixin(severeImpact);

  const severeMixin = (obj) => {
    obj.severeCasesByRequestedTime = 0.15 * obj.infectionsByRequestedTime;
    return false;
  };
  severeMixin(impact);
  severeMixin(severeImpact);

  const bedMixin = (obj) => {
    const num = capacity
    * data.totalHospitalBeds - obj.severeCasesByRequestedTime;
    const number = Math.trunc((num * 100) / 100);
    obj.hospitalBedsByRequestedTime = number;
  };
  bedMixin(impact);
  bedMixin(severeImpact);

  const ICUMixin = (obj) => {
    const number = 0.05 * obj.infectionsByRequestedTime;
    obj.casesForICUByRequestedTime = Math.trunc((number * 100) / 100);
    return false;
  };
  ICUMixin(impact);
  ICUMixin(severeImpact);

  const ACMixin = (obj) => {
    const number = 0.02 * obj.infectionsByRequestedTime;
    obj.casesForVentilatorsByRequestedTime = Math.trunc((number * 100) / 100);
    return false;
  };
  ACMixin(impact);
  ACMixin(severeImpact);

  const AC2Mixin = (obj) => {
    const number = obj.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation
    * data.region.avgDailyIncomeInUSD
    * data.timeToElapse;
    obj.dollarsInFlight = Math.trunc((number * 100) / 100);
  };
  AC2Mixin(impact);
  AC2Mixin(severeImpact);


  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
