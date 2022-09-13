import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'removeUSDT'})
export class RemoveUSDTPipe implements PipeTransform {
    transform(value: string): string {
        return value.replace('USDT','');
    }

}