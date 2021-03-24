import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "priceDelimiter",
})
export class PriceDelimiterPipe implements PipeTransform {
  transform(value: any, margin: number): any {
    if (!margin) margin = 3;
    //console.log(value, margin)
    if (!value) return null;
    value = "" + value;
    if (value.length < 4) return value;
    let valArr = value.split("").reverse();
    let transformedValue = [];
    for (let i = 1; i <= valArr.length; i++) {
      transformedValue.push(valArr[i - 1]);
      if (i % margin == 0) transformedValue.push(" ");
    }
    transformedValue.reverse();
    return transformedValue.join("").trim();
  }
}
