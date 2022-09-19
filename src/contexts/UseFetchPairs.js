import { useEffect, useState } from "react";
import coin_map from "./coin_map.json";


const toReadableCurrencyValue = (amount) => {
  if (amount > 10 ** 12) return `${(amount / 10 ** 12).toFixed(2)} T`
  if (amount > 10 ** 9) return `${(amount / 10 ** 9).toFixed(2)} B`
  if (amount > 10 ** 6) return `${(amount / 10 ** 6).toFixed(2)} M`
  if (amount > 10 ** 3) return `${(amount / 10 ** 3).toFixed(2)} K`
  return amount
}
const useFetchPairs = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const coinLogoDict = coin_map.reduce((prev, pair) => {
          prev[pair['symbol']] = pair['img_url']
          return prev
        }, {})
        const twentyFourHourPriceChangeResponsePromise = fetch('https://api.binance.com/api/v3/ticker/24hr')
        const pairDataPromise = fetch('https://www.binance.com/exchange-api/v2/public/asset-service/product/get-products');
        const [twentyFourHourPriceChangeResponse, pairData] = await Promise.all([twentyFourHourPriceChangeResponsePromise, pairDataPromise])
        const twentyFourHourPriceChangeResponseJson = await twentyFourHourPriceChangeResponse.json()
        const twentyFourHourPriceChangePairs = twentyFourHourPriceChangeResponseJson.filter(data => data['symbol'].includes('TUSD') && data['symbol'].indexOf('TUSD') > 1)
        const twentyFourHourPriceChangeDict = twentyFourHourPriceChangePairs.reduce((prev, pair) => {
          prev[pair['symbol']] = pair['priceChangePercent']
          return prev
        }, {})
        const pairDataJson = await pairData.json();
        const pairs = pairDataJson.data.filter(data => data['s'].includes('TUSD') && data['s'].indexOf('TUSD') > 1).map(data => {
          data['name'] = data['s'].replace('TUSD', '')
          data['mrk'] = toReadableCurrencyValue(data['c'] * data['cs'])
          data['24'] = twentyFourHourPriceChangeDict[data['s']]
          data['logo'] = coinLogoDict[data['name']]
          return data
        })
        setData(pairs);
      } catch (error) {
        setError(error);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);
  return { data, error, loaded };
};

export default useFetchPairs