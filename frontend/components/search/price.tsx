type PriceProps = {
    data: number;
}

const Price = ({data}: PriceProps) => {
    return (
        <div
        style={{
            display: 'flex',
            flexDirection: 'column',
        }}
        >
            {data}
        </div>
        )
}

export default Price;