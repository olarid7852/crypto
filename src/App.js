import useFetchPairs from './contexts/UseFetchPairs';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const { data, error, loaded } = useFetchPairs();
  const [socketValue, setSocketValue] = useState({})
  const [a, setA] = useState(1)
  // Connection opened
  let b = 1;
  const handleData = (trade) => {
    const tradeJson = JSON.parse(trade)['data']
    const symbol = tradeJson['s']
    socketValue[symbol] = Number(tradeJson['p'])
    setSocketValue(socketValue)
  }
  useEffect(() => {
    const socket = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@trade/bnbusdt@trade/ethusdt@trade/xrpusdt@trade');
    socket.addEventListener('open', (event) => {
    });
    socket.addEventListener('message', (event) => {
      handleData(event.data)
      b += 1
      setA(b)
    })
  }, [])
  return (
    <div className="App">
      <div className='container'>
        <div className='main'>
          <div>
          <h1>Watchlist</h1>
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Last</th>
                <th>24h%</th>
                <th>7d%</th>
                <th>Mrkt Cap</th>
              </tr>
            </thead>
            <tbody>
              {data && data.map((value, index) => (
                <tr key={value['s']}>
                  <td><img src={value['logo']} />{value['name']}</td>
                  <td>{socketValue[value['s']] || value['c']}</td>
                  <td className={value['24'] >= 0 ? 'positive' : 'negative'}>{value['24']}%</td>
                  <td>{value['7']}%</td>
                  <td>{value['mrk']}</td>
                </tr>)
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
