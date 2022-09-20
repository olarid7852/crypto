import { useEffect, useState } from "react";
import coin_map from "./coin_map.json";


const toReadableCurrencyValue = (amount) => {
  if (amount > 10 ** 12) return `${(amount / 10 ** 12).toFixed(1)}T`
  if (amount > 10 ** 9) return `${(amount / 10 ** 9).toFixed(1)}B`
  if (amount > 10 ** 6) return `${(amount / 10 ** 6).toFixed(1)}M`
  if (amount > 10 ** 3) return `${(amount / 10 ** 3).toFixed()}K`
  return amount
}
const BASE_CURRENCY = 'USDT'
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
        const sevenDaysPriceChangeResponsePromise = fetch('https://api.binance.com/api/v3/ticker?symbols=%5B"BTCUSDT","ETHUSDT","XRPUSDT","BNBUSDT"%5D&windowSize=7d')
        const twentyFourHourPriceChangeResponsePromise = fetch('https://api.binance.com/api/v3/ticker/24hr')
        const pairDataPromise = fetch('https://www.binance.com/exchange-api/v2/public/asset-service/product/get-products');
        const [sevenDaysPriceChangeResponseResponse, twentyFourHourPriceChangeResponse, pairData] = await Promise.all([sevenDaysPriceChangeResponsePromise, twentyFourHourPriceChangeResponsePromise, pairDataPromise])
        const twentyFourHourPriceChangeResponseJson = await twentyFourHourPriceChangeResponse.json()
        const twentyFourHourPriceChangePairs = twentyFourHourPriceChangeResponseJson.filter(data => data['symbol'].includes(BASE_CURRENCY) && data['symbol'].indexOf(BASE_CURRENCY) > 1)
        const twentyFourHourPriceChangeDict = twentyFourHourPriceChangePairs.reduce((prev, pair) => {
          prev[pair['symbol']] = pair['priceChangePercent']
          return prev
        }, {})
        const sevenDaysPriceChangeResponseResponseJson = await sevenDaysPriceChangeResponseResponse.json()
        const sevenDaysPriceChangeDict = sevenDaysPriceChangeResponseResponseJson.reduce((prev, pair) => {
          prev[pair['symbol']] = pair['priceChangePercent']
          return prev
        }, {})
        const pairDataJson = await pairData.json();
        const pairs = pairDataJson.data.filter(data => data['s'].includes(BASE_CURRENCY) && data['s'].indexOf(BASE_CURRENCY) > 1).map(data => {
          data['name'] = data['s'].replace('USDT', '')
          data['mrk'] = toReadableCurrencyValue(data['c'] * data['cs'])
          data['24'] = Number(twentyFourHourPriceChangeDict[data['s']]).toFixed(2)
          data['7'] = sevenDaysPriceChangeDict[data['s']] ? Number(sevenDaysPriceChangeDict[data['s']]).toFixed(2) : '0.00'
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