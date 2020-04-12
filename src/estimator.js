const covid19ImpactEstimator = (data) => {
  if (data.periodType === 'months') data.timeToElapse *= 30;
  if (data.periodType === 'weeks') data.timeToElapse *= 7;
  const severeImpact = {};
  const impact = {};
  // const estimation = {};
  // const capacity = 0.35;

  const currentMixim = (obj) => {
    obj.currentlyInfected = data.reportedCases * 10;
  };
  currentMixim(impact);

  const severeCurrentMixim = (obj) => {
    obj.currentlyInfected = () => data.reportedCases * 50;
  };

  severeCurrentMixim(severeImpact);

  const factor = Math.floor(data.timeToElapse / 3);

  const infectMixin = (obj) => {
    obj.infectionsByRequestedTime = () => obj.currentlyInfected * 2 ** factor;
  };

  infectMixin(impact);
  infectMixin(severeImpact);

  // const severeMixin = (obj) => {
  //   obj.severeCasesByRequestedTime = () => 0.15 * obj.infectionsByRequestedTime;
  // };
  // const bedMixin = (obj) => {
  //   obj.hospitalBedsByRequestedTime = () => capacity * obj.totalHospitalBeds;
  // };
  // const ICUMixin = (obj) => {
  //   obj.casesForICUByRequestedTime = () => 0.05 * obj.infectionsByRequestedTime;
  // };
  // const ACMixin = (obj) => {
  //   obj.casesForVentilatorsByRequestedTime = () => 0.02 * obj.infectionsByRequestedTime;
  // };
  // const AC2Mixin = (obj) => {
  //   obj.dollarsInFlight = () => obj.infectionsByRequestedTime
  //   * obj.region.avgDailyIncomePopulation
  //   * obj.region.avgDailyIncomeInUSD
  //   * obj.timeToElapse;
  // };

  // obj.hospitalBedsByRequestedTime > 0
  //   ? obj.hospitalBedsByRequestedTime
  //   : -1 * obj.severeCasesByRequestedTime;

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
