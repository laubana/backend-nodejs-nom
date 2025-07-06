const extractedInfo = (cardDetails) =>
  cardDetails.map((cardDetail) => {
    const { card, id } = cardDetail;
    const { brand, exp_month: expMonth, exp_year, last4 } = card;
    const expYear = exp_year.toString().slice(-2);

    return {
      brand,
      expMonth,
      expYear,
      last4,
      paymentMethodId: id,
    };
  });

module.exports = {
  extractedInfo,
};
