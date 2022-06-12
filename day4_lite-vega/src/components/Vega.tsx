import React, { useEffect, useState } from 'react'
import { Vega } from 'react-vega'

interface IInitData {
	dataSource: IStudent[]
	fields: {
		fid: string
		analyticType: string
		semanticType: string
	}[]
}

type IStudent = {
	gender: string
	lunch: string
	[key: string]: string | number
}

export default () => {
	const [data, setData] = useState<
		{
			'parental level of education': string
			'math score': number
		}[]
	>([])
	useEffect(() => {
		const initData = async () => {
			const res = await fetch('./assets/ds-students-service.json')
			const data: IInitData = await res.json()
			const [field] = data?.fields.filter(
				(field) => field.fid === 'parental level of education'
			)
			const types: {
				[key: string]: any
			} = {}
			data?.dataSource.forEach((s: IStudent) => {
				const type = s[field.fid]
				if (typeof types[type] === 'undefined') {
					types[type] = {
						value: s['math score'],
						count: 1
					}
				} else {
					types[type].value += s['math score']
					types[type].count++
				}
			})
			// console.log(types)
			const formatData = Object.entries(types).map(
				([type, { value, count }]) => ({
					sortBy: 'parental level of education',
					'parental level of education': type,
					'math score': +(value / count).toFixed(2)
				})
			)
			console.log('formatData: ', formatData)
			setData(formatData)
		}
		initData()
	}, [])

	const spec = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description:
			'Two vertically concatenated charts that show a histogram of precipitation in Seattle and the relationship between min and max temperature.',
		transform: [
			{
				filter: "datum.sortBy === 'parental level of education'"
			}
		],
		vconcat: [
			{
				mark: 'bar',
				encoding: {
					x: {
						field: 'parental level of education',
						type: 'nominal'
					},
					y: {
						field: 'math score',
						type: 'quantitative'
					}
				}
			},
			{
				mark: 'line',
				encoding: {
					x: {
						field: 'parental level of education',
						type: 'nominal'
					},
					y: {
						field: 'math score',
						type: 'quantitative'
					}
				}
			},
			{
				mark: 'arc',
				encoding: {
					color: {
						field: 'parental level of education',
						type: 'nominal'
					},
					theta: {
						field: 'math score',
						type: 'quantitative'
					}
				}
			}
		]
	}
	return (
		<Vega
			spec={{
				...spec,
				width: 400,
				height: 300,
				data: {
					values: data
				}
			}}
		/>
	)
}
