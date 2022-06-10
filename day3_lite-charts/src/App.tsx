import React, { useState, useEffect } from 'react'
import { from, map } from 'rxjs'
import Bar from './plugins/visualMap/Bar'
import Line from './plugins/visualMap/Line'
import Pie from './plugins/visualMap/Pie'
import './App.css'

function App() {
	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		setData(data.map((item) => Math.random() * 1000))
	// 	}, 1000)
	// 	return () => {
	// 		clearInterval(timer)
	// 	}
	// }, [])

	useEffect(() => {
		from(fetch('./assets/ds-students-service.json'))
			.pipe(map((res) => res.json()))
			.subscribe(async (res) => {
				const result = await res
				const field = result?.fields.filter(
					(f: any) => f.fid === 'parental level of education'
				)
				const types: {
					[key: string]: any
				} = {}

				result.dataSource.forEach((ss: any) => {
					const type = ss[field[0].fid]
					if (typeof types[type] === 'undefined') {
						types[type] = {
							value: ss['math score'],
							count: 1
						}
					} else {
						types[type].value += ss['math score']
						types[type].count++
					}
				})
				const data: {
					name: string
					value: number
				}[] = []
				Object.entries(types).forEach(([key, value]) => {
					console.log(value)
					data.push({
						name: key,
						value: value.value / value.count
					})
				})
				setData(data)
			})
	}, [])

	const [data, setData] = useState<
		{
			name: string
			value: number
		}[]
	>([])
	return (
		<div className="App">
			<Bar data={data} config={{ width: 800, height: 400, padding: 4 }} />
			<Line
				data={data}
				config={{ width: 800, height: 200, padding: 4 }}
			/>
			<Pie data={data} config={{ width: 600, padding: 4 }}></Pie>
		</div>
	)
}

export default App
