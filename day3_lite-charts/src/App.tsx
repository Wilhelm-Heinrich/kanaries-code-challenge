import React, { useState } from 'react'
import Bar from './plugins/visualMap/Bar'
import Line from './plugins/visualMap/Line'
import Pie from './plugins/visualMap/Pie'
import './App.css'

function App() {
	const [data] = useState([4, 100, 15, 30, 23, 420])
	return (
		<div className="App">
			<Bar data={data} config={{ width: 200, height: 400, padding: 4 }} />
			<Line
				data={data}
				config={{ width: 400, height: 200, padding: 4 }}
			/>
			<Pie data={data} config={{ width: 600, padding: 4 }}></Pie>
		</div>
	)
}

export default App
