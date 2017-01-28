## Graphics2D.Shape

От объекта `Shape` -- наследуются все рисуемые объекты: `Rect`, `Circle`, `Path`, `Image`, `Text`, `TextBlock`.

### Создание
Как правило, первыми передаются параметры самого объекта, затем заливка и обводка (`fill` и `stroke`). Вместо них можно указать `null` (если понадобится указать stroke при отсутствии fill).  
Например:
```js
ctx.rect(10, 10, 200, 200, 'black', '2px black round');
ctx.rect(200, 200, 30, 30, null, '5pt green');
```

Можно создавать объекты иначе:
```js
ctx.rect({
  x: 10,
  y: 10,
  width: 200,
  height: 200,

  fill: 'black',
  opacity: 0.8,
  composite: 'xor'
});
```
Здесь помимо параметров самого объекта можно передать дополнительные: `fill`, `stroke`, `opacity`, `composite`, `visible`, `clip`.

Можно создавать объекты без заливки и обводки: они будут невидимы, но при этом будут реагировать на события мыши (управляется функцией `mouse`).

Также везде можно указывать CSS-координаты:
```js
ctx.rect('10pt', '10pt', '0.5em' '1em');
```

### Методы:

Практически все параметры следуют "jQuery-way": вместо 2 функций "getAttr" и "setAttr" здесь присутствует одна функция "attr", которая ведёт себя по-разному в зависимости от аргументов. Отказ от традиционных свойств объекта (`shape.fill = 'red'`) связан с тем, что изменение любого свойства вызывает перерисовку контекста, в традиционных свойствах это возможно только через геттеры / сеттеры ES5.

Помимо этого, использование методов вместо свойств позволяет использовать "чеининг":
```js
shape.fill('red').stroke('blue 2px').opacity(0.3).show();
```

#### fill
Заливка объекта:
```js
rect.fill('red');
rect.fill(); // -> 'red'
```
Объект со свойством `colors` воспринимается как градиент:
```js
rect.fill({
    colors:['red', 'green', 'black'],
    from: 'top',
    to: 'bottom'
});
```
Если передаётся объект со свойством `image`, картинка (обычный dom-элемент `img` или объект `Image`), или же строка, начинающаяся с `http://`, `./`, `../` или `data`, это понимается как текстура.
```js
rect.fill('./image.jpg');
```

При этом создаётся объект `Gradient` или `Pattern`, который можно дальше изменять:
```js
rect.fill({
    colors: ['white', 'black'],
    from: 'top',
    to: 'bottom'
});

rect.fill().color(0.5, 'red');
```

#### stroke
Обводка объекта:
```js
rect.stroke('10px red');
rect.stroke(); // -> {color: 'red', width: 10}
```
Чтобы изменить, можно передать строку или объект:
```js
rect.stroke('0.5em round square [1,2] green 0.5');
rect.stroke({
    color: 'black',
    width: '4px',
    join: 'round',
    cap: 'butt',
    dash: 'dot'
});
```
При этом изменяются только указанные параметры:
```js
rect.stroke('7pt'); // изменит только толщину, не тронув цвет и всё остальное
```

Возможные параметры:
- `width` / ширина -- `2px`, `0.5em`, `8` и т.п.
- `color` / цвет -- `#f00`, `green`, `rgb(0,0,0)` и т.п.
- `join`  / тип соединений -- `miter`, `bevel`, `round`.
- `cap`   / тип скруглений -- `butt`, `square`, `round`.
- `dash`  / пунктир -- `[1,2,2]`, `shortdash`, `shortdot`, `shortdashdot`, `shortdashdotdot`, `dot`, `dash`, `longdash`, `dashdot`, `longdashdot`, `longdashdotdot`.
- прозрачность -- `0.5`, `.3` -- всегда только float, указывается только в текстовом варианте, вычисляется сразу же (сделано для удобства -- например, `green 0.5` вместо `rgba(0, 128, 0, 0.5)`).

Можно сбросить все параметры (убрать stroke), передав `null`:
```js
rect.stroke(null);
```

#### opacity
Прозрачность (число от 0 до 1).

#### composite
Функция наложения объектов друг на друга. Варианты: `source-over`, `source-atop`, `source-in`, `source-out`, `destination-over`, `destination-atop`, `destination-in`, `destination-out`, `lighter`, `darker`, `copy`, `xor`.

Некоторые браузеры поддерживают немного больше: `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`.

Стандарт: http://dev.w3.org/fxtf/compositing-1  
MDN: http://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing

#### hide, show
Делают объект видимым / невидимым. Без анимации, просто отключают его отрисовку.  

Ожидается, что невидимый объект не будет реагировать на события, поэтому `hide` / `show` также включают / отключают обработку событий мыши. Если требуется другое поведение, нужно использовать функцию `mouse` после этого.

#### cursor
Устанавливает курсор при наведении мыши на объект. *(пока работает не всегда корректно)*
```js
rect.cursor('pointer');
```

#### z
Z-index объекта.

Z-index в понятии Graphics2D -- просто индекс элемента (а, соответственно, и каким по счёту отрисовывается):
```js
// предполагается, что canvas пуст, так что начальный z-index = 0
var a = ctx.rect(10, 10, 200, 200);
var b = ctx.circle(100, 100, 50);
a.z(); // -> 0
b.z(); // -> 1

b.z(0);
b.z(); // -> 0
a.z(); // -> 1
```
Двух объектов с одинаковым индексом существовать на одном контексте не может.

#### isPointIn(x, y)
Возвращает `true`, если точка `(x; y)` находится внутри объекта / фигуры, иначе `false`.

При этом учитывается сама фигура, а не её прямоугольник.

#### bounds
/*
Возвращает прямоугольник (хитбокс) объекта. Свойства:
 - `x`, `y` или `x1`, `y1` -- координаты левой верхней точки.
 - `x2`, `y2` -- координаты правой нижней точки.
 - `width`, `height` = `w`, `h` -- ширина и высота.
 - `cx`, `cy` -- координаты центра.

Также можно передать объект со свойством `transform` (true / false) и `stroke` (true / false / 'exclude') -- обрабатывать ли трансформацию и обводку ('exclude' исключает размеры обводки из объекта):
```js
var bounds1 = shape.bounds(),
    bounds2 = shape.bounds({ transform: false });
```
По умолчанию `transform: true, stroke: false`. */

#### corner
Возвращает координаты одного из углов объекта:
```js
var coords = shape.corner('left top');
// -> [x, y]
```
Также можно передать объект со свойством `from` и отступом от угла:
```js
shape.corner({ from: 'left top', x: 10, y: 50 });
// -> [x + 10, y + 50]
```

Возможные значения: углы (`left top`, `right top`, `left bottom`, `right bottom`), возможна перестановка слов (`left top` = `top left`), возможны сокращения (`left top` = `lt` = `tl`), также есть середины сторон (`left`, `top`, `right`, `bottom`) и центр (`center`).

#### clip
Маска объекта (фигура, скрывающая часть исходного объекта).

Можно передать любой стандартный объект контекста:
```js
shape.clip( ctx.path([[0, 0], [100, 100], [200, 0]]) );
```

Если передаются 4 аргумента, то создаётся прямоугольник (x, y, width, height). Передаются абсолютные координаты (координаты canvas-а, а не координаты самого объекта):
```js
shape.clip( 0, 0, 30, 30 );
```

3 аргумента -- координаты круга (cx, cy, radius):
```js
shape.clip( 50, 50, 100 );
```

1 аргумент -- путь:
```js
shape.clip([[0, 0], [200, 200], [200, 0]]);
```

Или своя функция:
```js
shape.clip({
    processPath: function(ctx){
        // ctx -- стандартный 2D Context
        ctx.moveTo( 10, 10 );
        ctx.lineTo( 300, 300 );
        ctx.lineTo( 300, 0 );
        ctx.closePath();
    }
});
```

Переданный первым аргументом `null` удаляет маску:
```js
shape.clip(null);
```

#### remove
Удаляет объект из отрисовки контекста (но при этом объект остаётся в памяти, так что его можно использовать в дальнейшем, в т.ч. вставить обратно в контекст):
```js
var rect = ctx.rect( 100, 100, 50, 50, 'blue' );
rect.remove();

rect.x(); // -> 100

ctx.push( rect ); // возвращает объект в контекст
```

#### shadow
Тень. Можно передать объект с параметрами:
```js
shape.shadow({
    x: 0,
    y: 5,
    blur: 5,
    color: 'black',
    opacity: 0.5
});
```

Можно передавать в CSS-форме (`x y blur color`):
```js
shape.shadow('0 2px 2px red');
```

Изменять и получать параметры по отдельности (числовые параметры возвращаются в пикселях):
```js
shape.shadow('blur'); // -> 2
shape.shadow('blur', 5);
```

### События
Функции:
 - `on(event, func)`
 - `off(event, [func])`
 - `fire(event, [object])`
 - `click`
 - `dblclick`
 - `mousedown`
 - `mouseup`
 - `mousemove`
 - `mouseover`
 - `mouseout`
 - `mousewheel`
 - `focus`
 - `blur`
работают абсолютно аналогично соответствующим функциям контекста.

#### mouse
Включает / отключает обработку событий мыши. Объект, на котором отключена обработка событий мыши, становится "проницаемым": события мыши будут срабатывать на элементах под ним.
```js
// отключаем
shape.mouse(false);

// включаем
shape.mouse(true);
```

### Трансформации
Все трансформации (кроме `translate`) принимают параметр `pivot` -- центр трансформации (например, в случае с `rotate` -- вокруг какой точки происходит вращение). Можно передать как абсолютные координаты (`[0,0]`, `{x:10, y:10}`), так и одну из точек фигуры: `left`, `right`, `top`, `bottom`, `left top` / `top left` / `lt` / `tl` и т.д.

По умолчанию точка -- центр фигуры.
#### scale
```js
rect.scale(2);
rect.scale(0.5, 0.5);
rect.scale(2, 'left top');
rect.scale(0.5, 0.5, 'center');
```
Увеличивает фигуру, можно передать как по x,y разные размеры, так и одинаковые.

#### rotate
```js
rect.rotate(45);
rect.rotate(10, 'left');
```
Поворачивает фигуру, указываются градусы (можно перевести градусы в радианы как `degree / 180 * Math.PI`, а налогично наоборот `rad / Math.PI * 180`).

#### skew
```js
rect.skew(10, 0);
rect.skew(5);
rect.skew(-10, 0, 'left');
rect.skew(-5, 'top');
```
"Сдвигает" фигуру. Указываются градусы.

#### translate(x, y)
```js
rect.translate(10, 10);
```
Сдвигает фигуру по осям координат. Полезно, когда мы по-разному трансформировали фигуру, у неё смещаются оси координат, и простое изменение её координат даст нам немного неожиданное поведение.

#### transform
```js
rect.transform(2, 0, 0, 1.5, 0, 0); // вокруг центра
rect.transform(0.5, 0, 0, 0.75, 0, 0, 'top');
```
Трансформирует фигуру. Как это делается, подробнее здесь: http://www.intuit.ru/studies/courses/1063/210/lecture/5434?page=5

### Анимация
Функция `animate`:
```js
rect.animate('width', '2em');
// param, value, duration, easing, after
rect.animate('width', 200,  3000, 'bounceOut', function(){ this.fill('blue'); });

rect.animate({ width:200, x:0 }, 3000, 'bounceOut', afterfunc);
rect.animate({ fill: 'red', stroke:'4px' }, {
 duration: 1000,
 easing: function(x){ return Math.pow(x, 4) },
 after: function(){ this.hide() }
});
```
Вроде бы всё понятно. Доступные параметры для анимирования:
- `opacity`
- `fill` (без поддержки градиентов и текстур)
- `stroke` (только цвет и ширина)
- `crop` -- для изображений
- `x`, `y`, `width`, `height`, `cx`, `cy`, `radius` -- параметры фигур
- `rotate`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY`, `translate`, `translateX`, `translateY` -- трансформации. Все только вокруг центра фигуры, по-другому пока никак. Вот так: `skew:[10,3]` писать нельзя (пока что), нужно так: `skewX:10, skewY:3`.

Можно добавить свои...