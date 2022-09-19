import useFetchPairs from './contexts/UseFetchPairs';
import './App.css';

function App() {
  const {data, error, loaded} = useFetchPairs();
  return (
    <div className="App">
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
            <tr key={index}>
              <td><img src={value['logo']}/>{value['name']}</td>
              <td>{value['c']}</td>
              <td className={value['24'] >= 0 ? 'positive' : 'negative'}>{value['24']}%</td>
              <td>16%</td>
              <td>{value['mrk']}</td>
            </tr>)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
