const covid19ImpactEstimator = (data) => {
  if (data.periodType === 'months') { data.timeToElapse *= 30; } else if (data.periodType === 'weeks') { data.timeToElapse *= 7; } else { data.timeToElapse = data.timeToElapse; }
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
    return false;
  };
  bedMixin(impact);
  bedMixin(severeImpact);

  const ICUMixin = (obj) => {
    obj.casesForICUByRequestedTime = 0.05 * obj.infectionsByRequestedTime;
    return false;
  };
  ICUMixin(impact);
  ICUMixin(severeImpact);


  const ACMixin = (obj) => {
    obj.casesForVentilatorsByRequestedTime = 0.02 * obj.infectionsByRequestedTime;
    return false;
  };
  ACMixin(impact);
  ACMixin(severeImpact);

  const AC2Mixin = (obj) => {
    const numbe = obj.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation
    * data.region.avgDailyIncomeInUSD
    * data.timeToElapse;
    const numbr = Math.trunc((numbe * 100) / 100);
    obj.dollarsInFlight = numbr;
    return false;
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
