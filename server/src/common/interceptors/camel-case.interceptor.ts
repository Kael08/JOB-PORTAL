import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CamelCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transformToCamelCase(data)));
  }

  private transformToCamelCase(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformToCamelCase(item));
    }

    if (typeof data === 'object' && data.constructor === Object) {
      const camelCaseObj: any = {};

      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const camelKey = this.snakeToCamel(key);
          camelCaseObj[camelKey] = this.transformToCamelCase(data[key]);

          if (key === 'id') {
            camelCaseObj._id = data[key];
          }
        }
      }

      return camelCaseObj;
    }

    return data;
  }

  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }
}
