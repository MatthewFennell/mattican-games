import React from 'react';
import RadioButton from '../../common/radio/RadioButton';
import StyledButton from '../../common/StyledButton/StyledButton';

export const RadioAscDesc = (value, onChange, label) => (
    <RadioButton
        text={label}
        onChange={onChange}
        options={[
            {
                text: 'Asc',
                value: 'Asc'
            },
            {
                text: 'Desc',
                value: 'Desc'
            }
        ]}
        value={value}
    />
);

export const RadioPosition = (value, onChange, label) => (
    <RadioButton
        text={label}
        onChange={onChange}
        options={[
            {
                text: 'GK',
                value: 'GOALKEEPER'
            },
            {
                text: 'Def',
                value: 'DEFENDER'
            },
            {
                text: 'Mid',
                value: 'MIDFIELDER'
            },
            {
                text: 'Att',
                value: 'ATTACKER'
            }
        ]}
        value={value}
    />
);

export const GridHeaderButton = (text, onClick) => (
    <StyledButton
        text={text}
        smallButton
        onClick={onClick}
    />
);

export const marks = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 2,
        label: '2'
    },
    {
        value: 4,
        label: '4'
    },
    {
        value: 6,
        label: '6'
    },
    {
        value: 8,
        label: '8'
    },
    {
        value: 10,
        label: '10'
    }
];

export const getColumns = openModal => [
    {
        id: 'name',
        name: 'Name',
        label: 'Name',
        fixed: true,
        active: true,
        align: 'center'
    },
    {
        id: 'position',
        name: 'Pos',
        label: GridHeaderButton('Pos', openModal),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'team',
        name: 'Team',
        label: GridHeaderButton('Team', openModal),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'price',
        name: 'Price',
        label: GridHeaderButton('Price', openModal),
        fixed: false,
        active: false,
        align: 'center'
    },
    {
        id: 'points',
        name: 'Points',
        label: GridHeaderButton('Points', openModal),
        fixed: false,
        active: true,
        align: 'center'
    },
    {
        id: 'goals',
        name: 'Goals',
        label: GridHeaderButton('Goals', openModal),
        fixed: false,
        active: false,
        align: 'center'
    },
    {
        id: 'assists',
        name: 'Assists',
        label: GridHeaderButton('Assists', openModal),
        fixed: false,
        active: false,
        align: 'center'
    },
    {
        id: 'previousScore',
        name: 'Previous Score',
        label: GridHeaderButton('Prev Score', openModal),
        fixed: false,
        active: false,
        align: 'center'
    }
];
