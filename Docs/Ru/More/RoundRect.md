Graphics2D.RoundRect
===================

Прямоугольник со скруглёнными углами. Создаётся точно также, как и обычный, но при передаче параметров объектом, можно передать радиус углов (по x и по y).

### Создание
```js
ctx.roundrect({
  x: 10,
  y: 10,
  width: 200,
  height:200,
  fill:'red',

  rx: 10,
  ry: 10,
});
```

### Методы
#### x, y, width, height
#### x1, y1, x2, y2
Наследуются от rect.

#### rx, ry
Меняют / возвращают радиус углов.
```js
rect.rx(); // -> 5
rect.rx(10);
```

*Примечание: rx и ry можно анимировать.*