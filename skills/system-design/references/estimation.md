# Estimation

A quick estimate shows the order of magnitude. It does not replace a measurement or a load test.
Write each input, its source, and whether it is measured or assumed. Round to simple numbers.

## Load

| Quantity | Calculation |
| --- | --- |
| Average requests per second | Daily requests divided by 86,400 seconds. |
| Peak requests per second | The average times a peak factor. Take the factor from traffic data, or mark it as an assumption. |
| Reads and writes | Estimate them separately. They often scale in different ways. |
| Storage | Records per day times the average record size times the retention period, plus indexes and replicas. |
| Bandwidth | Peak requests per second times the average response size. |
| Working set | The part of the data that is read often. It decides whether a cache can hold it. |

Compare each result with the capacity of one instance or one store, to find the first limit.
Capacity headroom and failure domains are in `skills/reliability-review/references/capacity-and-data.md`.

## Cost

Give a cost as a unit cost first, such as cost for each thousand requests or each active customer, then as a monthly total.
Record the price source and the date. Prices change, so do not copy prices from memory.
Include the cost of data transfer between zones and regions, and the operator time that the design adds.
Compare the cost of each design option with the same inputs.
