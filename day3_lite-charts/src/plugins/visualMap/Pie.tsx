import React, { FC, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { DefaultArcObject } from 'd3'

interface IConfig {
	width: number
	padding?: number
}

interface IProps {
	data: number[]
	config: IConfig
}

interface IArc {
	startAngle: number
	endAngle: number
	data: any
	index: number
	value: number
	padAngle: number
}

const Pie: FC<IProps> = ({ data, config }) => {
	const padding = config.padding || 4
	const innerRadius = 0
	const outerRadius = config.width / 2 - padding * 2
	const labelRadius = innerRadius * 0.2 + outerRadius * 0.8
	const padAngle = 1 / outerRadius
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	const origin = [
		(config.width - padding * 2) / 2,
		(config.width - padding * 2) / 2
	]

	const [arcs, setArcs] = useState<IArc[]>([])

	useEffect(() => {
		const arcs = d3.pie().padAngle(padAngle).sort(null)(data)
		setArcs(arcs)
		const arcLabel = d3
			.arc()
			.innerRadius(labelRadius)
			.outerRadius(labelRadius)
	}, [data])

	return (
		<svg
			style={{
				width: config.width,
				height: config.width,
				border: '1px solid #CCC',
				padding,
				boxSizing: 'border-box'
			}}
		>
			{/* 主图 */}
			<g transform={`translate(${origin[0]},${origin[1]})`}>
				{arcs &&
					arcs.map((arcInfo) => {
						const c = color(arcInfo.data)
						return (
							<path
								fill={c}
								key={arcInfo.index}
								d={d3.arc()({
									...arcInfo,
									innerRadius,
									outerRadius
								})}
								strokeLinejoin="round"
								stroke="#FFF"
								strokeLinecap="butt"
							></path>
						)
					})}
			</g>
			{/* 文字 */}
			<g transform={`translate(${origin[0]},${origin[1]})`}>
				{arcs &&
					arcs.map((arcInfo) => {
						return (
							<text
								key={arcInfo.index}
								fill="#FFF"
								textAnchor="middle"
								transform={`translate(${d3.arc().centroid({
									...arcInfo,
									innerRadius,
									outerRadius
								})})`}
								fontSize="12"
							>
								{arcInfo.data}
							</text>
						)
					})}
			</g>
		</svg>
	)
}

Pie.defaultProps = {
	config: {
		width: 200,
		padding: 4
	}
}

export default Pie
