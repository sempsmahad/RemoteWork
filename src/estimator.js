const covid19ImpactEstimator = (data) => {
  const data = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  };

  const output = {
    data: {}, // the input data you got
    impact: {}, // your best case estimation
    severeImpact: {} // your severe case estimation
  };

  if (data.periodType === "months")data.timeToElapse *= 30
  if (data.periodType === "weeks")data.timeToElapse *= 7
  let severeImpact ={}
  let impact ={}
  impact.currentlyInfected = data.reportedCases*10
  severeImpact.currentlyInfected = data.reportedCases * 50
  let factor = Math.floor(data.timeToElapse/3);

  
  let infectMixin = obj=>{
    obj.infectionsByRequestedTime = obj.currentlyInfected *(2**factor);
  }
  infectMixin(impact);
  infectMixin(severeImpact);

};

export default covid19ImpactEstimator;
