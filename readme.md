# Quiet NaN Enumerator
Enumerate quiet NaN values.

## Features
Get the ID assigned to NaN value / Get NaN value by ID

## Installation
```shell
npm install qnan-enumerator
```

## Usage
```javascript
import QNanEnumerator from "qnan-enumerator";

const enumerator = new QNanEnumerator();

const nan = enumerator.getNan(125);  // get NaN value with ID 125
const id = enumerator.getId(nan);    // get the ID of NaN value

console.log(id === 125);  // true
```
