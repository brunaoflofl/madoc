import { isString } from 'lodash';

export class Collection {
  public static ordena(a, b, order = -1) {
    const latin_map = {
      'à': 'a', 'â': 'a', 'á': 'a', 'ã': 'a', 'Ã': 'A', 'Á': 'A', 'À': 'A', 'Â': 'A',
      'é': 'e', 'è': 'e', 'ê': 'e', 'É': 'E', 'È': 'E', 'Ê': 'E',
      'í': 'i', 'Í': 'I',
      'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o', 'Ö': 'O', 'Ó': 'O', 'Ò': 'O', 'Ô': 'O',
      'ü': 'u', 'ú': 'u', 'ù': 'u', 'û': 'u', 'Ú': 'U' , 'Ü': 'U', 'Ù': 'U', 'Û': 'U',
      'ß': 's', 'ç': 'c', 'Ç': 'C'
    };

    const first  = !isString(a.display) ? a.display
      : a.display.replace(/[^A-Za-z0-9\[\] ]/g, function (match) { return latin_map[match] || match; });
    const second = !isString(b.display) ? b.display
      : b.display.replace(/[^A-Za-z0-9\[\] ]/g, function (match) { return latin_map[match] || match; });

    if (first < second) {
      return order;
    }
    if (first > second) {
      return order * -1;
    }
    return 0;
  }
}
