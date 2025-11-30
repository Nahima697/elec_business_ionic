import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const clone = req.clone({
     url: req.url.startsWith('http') ? req.url : environment.apiUrl + req.url
  })
  return next(clone);
};
