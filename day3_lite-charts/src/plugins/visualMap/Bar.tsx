import React, { FC, useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'

interface IConfig {
	width: number
	height: number
	padding?: number
	direction?: IDirection
}

enum IDirection {
	H = 'horizontal',
	V = 'vertical'
}

interface IProps {
	data: {
		name: string
		value: number
	}[]
	config: IConfig
}

const Bar: FC<IProps> = ({ data, config }) => {
	const types = data.map(({ name }) => name)
	const values = data.map(({ value }) => value)
	const padding = config.padding || 4
	const xAxis = useRef<SVGGElement>(null)
	const yAxis = useRef<SVGGElement>(null)

	const maxValue = useMemo(() => {
		return Math.max(...values)
	}, [data])

	const xScale = useMemo(() => {
		return d3
			.scaleBand()
			.domain(types)
			.range([0, config.width - padding * 2 - 40])
	}, [data])

	const maxYSacle = useMemo(() => {
		return config.height - 60
	}, [data])

	const yScale = useMemo(() => {
		return d3
			.scaleLinear()
			.domain([maxValue, 0])
			.range([0, config.height - padding * 2 - 40])
	}, [data])

	useEffect(() => {
		if (xAxis.current) {
			const xAxisD3 = d3.axisBottom(xScale)
			d3.select(xAxis.current).call(xAxisD3)
		}
	}, [data])

	useEffect(() => {
		if (yAxis.current) {
			const yAxisD3 = d3.axisLeft(yScale)
			d3.select(yAxis.current).call(yAxisD3)
		}
	}, [data])

	return (
		<svg
			style={{
				width: config.width,
				height: config.height,
				border: '1px solid #CCC',
				padding,
				boxSizing: 'border-box'
			}}
		>
			{/* 主图 */}
			<g>
				{values.map((d, i) => {
					return (
						<rect
							key={i}
							x={xScale.bandwidth() * i + padding + 30}
							y={config.height - (d / maxValue) * maxYSacle - 30}
							width={xScale.bandwidth() - 10}
							height={(d / maxValue) * maxYSacle}
							fill="steelblue"
						></rect>
					)
				})}
			</g>
			<g
				ref={xAxis}
				transform={`translate(30, ${config.height - padding * 2 - 20})`}
			></g>
			<g ref={yAxis} transform={`translate(30, 20)`}></g>
		</svg>
	)
}

Bar.defaultProps = {
	config: {
		width: 200,
		height: 200,
		padding: 4,
		direction: IDirection.H
	}
}

export default Bar
