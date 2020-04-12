const covid19ImpactEstimator = (data) => {
  if (data.periodType === 'weeks') { data.timeToElapse *= 7; } else if (data.periodType === 'months') { data.timeToElapse *= 30; }
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

  const factor = Math.trunc(data.timeToElapse / 3);

  const infectMixin = (obj) => {
    obj.infectionsByRequestedTime = obj.currentlyInfected * (2 ** factor);
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
    const number = Math.trunc((capacity
      * data.totalHospitalBeds) - obj.severeCasesByRequestedTime);
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
    obj.dollarsInFlight = Math.trunc((obj.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD)
      / data.timeToElapse);
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
