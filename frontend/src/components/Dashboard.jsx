import { useEffect, useState } from "react";
import PropTypes from "prop-types";
function Dashboard({ setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  let formattedData;
  const [data, setData] = useState("");
  const fetchData = async () => {
    let result = await fetch("http://localhost:5000/robotic-data", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    const array = [
      `Time:${result.time}`,
      `Battery:${result.batteryLevel}`,
      `Status:${result.status}`,
      `Activity:${result.formattedActivityLog}`,
    ];
    formattedData = array.join("\n\n");
    setData(formattedData);
  };
  useEffect(() => {
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  });

  const [filterData, setFilterData] = useState("");
  const [option, setOption] = useState("High Battery");
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(24);
  const handleFilters = async () => {
    const response = await fetch(
      `http://localhost:5000/historical-data?batteryLevel=${option}&startTime=${fromValue}&endTime=${toValue}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const filteredData = await response.json();
    // Format the filtered data for display
    const formattedFilteredData = filteredData
      .map((entry) => {
        return `Time: ${entry.time}\nBattery: ${entry.batteryLevel}\nStatus: ${entry.status}\nActivity: ${entry.activityLog}\n`;
      })
      .join("\n");
    setFilterData(formattedFilteredData);
  };

  useEffect(() => {
    const fromInput = document.getElementById("startRange");
    const toInput = document.getElementById("endRange");

    if (fromInput && toInput) {
      fromInput.value = fromValue;
      toInput.value = toValue;
    }
  }, [fromValue, toValue]);

  // ... (existing code)

  const handleFromChange = (event) => {
    const value = parseInt(event.target.value);
    const paddedValue = value < 10 ? `0${value}` : value.toString();
    setFromValue(paddedValue);
  };

  const handleToChange = (event) => {
    const value = parseInt(event.target.value);
    const paddedValue = value < 10 ? `0${value}` : value.toString();
    setToValue(paddedValue);
  };
  return (
    <div className="Dashboard">
      <div className="bg"></div>
      <div className="Logout">
        <button onClick={handleLogout} className="Btn">
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>
          <div className="text">Logout</div>
        </button>
      </div>
      <div className="card">
        <div className="info">
          <label className="label">Realtime Data</label>
          <textarea
            placeholder="realtime data will be displayed here every minute or by clicking refresh button"
            value={data}
            readOnly
            cols={1}
            style={{ resize: "none" }}
          />
          <button className="refresh" onClick={fetchData}>
            Refresh
          </button>

          <div className="filters">
            <label className="label">Filters</label>
            <br></br>
            <button onClick={handleFilters} className="submit">
              Submit
            </button>
            <select
              className="dropdown"
              id="dropdown"
              name="dropdown"
              value={option}
              onChange={(e) => setOption(e.target.value)}
            >
              <option value="high">High Battery</option>
              <option value="medium">Medium Battery</option>
              <option value="low">Low Battery</option>
              <option value="idle">Idle Status</option>
              <option value="active">Active Status</option>
              <option value="charging">Charging Status</option>
            </select>
          </div>
          <div className="slidercont1">
            <p className="PB-range-slidervalue1">From:{fromValue}</p>
            <input
              type="range"
              className="slider"
              id="startRange"
              min="1"
              max="24"
              step="1"
              onChange={handleFromChange}
            />
          </div>
          <div className="slidercont2">
            <p className="PB-range-slidervalue2">To:{toValue}</p>
            <input
              type="range"
              className="slider"
              id="endRange"
              min="1"
              max="24"
              step="1"
              onChange={handleToChange}
            />
          </div>
        </div>
        <div className="historic-data">
          <label className="label">Filtered Data</label>

          <textarea
            className="filtered-data"
            placeholder="Historical data with filters will be displayed here"
            readOnly
            cols={30}
            style={{ resize: "none" }}
            value={filterData}
          />
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired, // Specify the type and mark it as required
};

export default Dashboard;
