import React from 'react';
import { Tooltip, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, BarProps } from 'recharts';
import { roundNumber } from '@/module/tools';

const colors = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    'red',
    'pink',
    'var(--grey)',
    'var(--hotpink)',
    'var(--blue)',
    'var(--orange)',
];

interface DataItem {
    type: string;
    count: number;
}

const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
        x + width / 2
    }, ${y} C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height} Z`;
};

const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x as number, y as number, width as number, height as number)} stroke="none" fill={fill} />;
};

export default function MyCustomBarChart({ data, ...props }: any) {
    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip
                formatter={(value, name, props) => {
                    return [`${props.payload.type} ${roundNumber(+value, 2)}`, ''];
                }}
            />
            <Bar dataKey="count" fill="#8884d8" label={{ position: 'top' }}>
                {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                ))}
            </Bar>
        </BarChart>
    );
}
