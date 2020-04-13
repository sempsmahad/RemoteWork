const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let days = data.timeToElapse;
  if (data.periodType === 'weeks') days *= 7;
  else if (data.periodType === 'months') days *= 30;

  const factor = Math.trunc(days / 3);

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const firstMixim = (obj) => {
    obj.infectionsByRequestedTime = obj.currentlyInfected * (2 ** factor);
    return false;
  };
  firstMixim(impact);
  firstMixim(severeImpact);

  const secondMixim = (obj) => {
    obj.severeCasesByRequestedTime = Math.trunc(0.15 * obj.infectionsByRequestedTime);
  };
  secondMixim(impact);
  secondMixim(severeImpact);

  const thirdMixim = (obj) => {
    obj.hospitalBedsByRequestedTime = Math.trunc((0.35 * data.totalHospitalBeds)
    - obj.severeCasesByRequestedTime);
  };
  thirdMixim(impact);
  thirdMixim(severeImpact);

  const fourthMixim = (obj) => {
    obj.casesForICUByRequestedTime = Math.trunc(0.05 * obj.infectionsByRequestedTime);
  };
  fourthMixim(impact);
  fourthMixim(severeImpact);

  const fifthMixim = (obj) => {
    obj.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * obj.infectionsByRequestedTime);
  };
  fifthMixim(impact);
  fifthMixim(severeImpact);

  const sixthMixim = (obj) => {
    obj.dollarsInFlight = Math.trunc((obj.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD) / days);
  };
  sixthMixim(impact);
  sixthMixim(severeImpact);

  return {

    data: {},
    impact: {},
    severeImpact: {}

  };
};
export default covid19ImpactEstimator;
