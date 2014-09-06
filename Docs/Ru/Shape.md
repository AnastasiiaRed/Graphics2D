Graphics2D.Shape
===================

`Graphics2D.Shape` -- ������, �� �������� ����������� ������ �������� (`Rect`, `Circle`, `Path`, `Image`, `Text`, `TextBlock`) �������.

������� ���������� �� ����� ���������.

### ��������
��������� ��������. ������:
```js
ctx.rect(10, 10, 200, 200, 'black', '2px black round');
```
�� ���� �������� �� ������� ������� ��������� ����� ������, � ����� - ������� � �������. ��������� ������� ��������� ���� �����. � �������.

����� �����, �� ����� �������� ������, � � ��� � �������������� ���������:
```js
ctx.rect({
  x: 10,
  y: 10,
  width: 200,
  height: 200,
  fill: 'black',
  
  opacity:0.8,
  composite:'xor'
});
```
���������: `opacity`, `composite`, `visible`, `mask`.

������, ����������� ���������� ����� ��������� CSS-����������:
```js
ctx.rect('10pt', '10pt', '0.5em' '1em');
```

### ������:

#### fill([value])
���������� ������� ��������, ���� �������������.
```js
rect.fill('red');
rect.fill(); // -> 'red'
```
����� �����... �� ����� ���������� ����� ��������:
```js
rect.fill({ colors:['red', 'green', 'black'], from:'top', to:'bottom' });
rect.fill().from(); // -> 'top'
```
�, �� � ��������:
```js
rect.fill('./image.jpg');
```
�� ����������� �������� � ��������� -- � �� �������.

#### stroke([value])
���������� ������ � ����������� �������, ���� �� � �������������.
```js
rect.stroke();
// -> {color, width, cap, join, dash}
rect.stroke('2px red');
rect.stroke('5px'); // ���������� ������ ��������� ���������
rect.stroke();
// -> {color:'red', width:5} -- ������ ��� ������-�����
```
����������, ��������� ���������:
- `width` / ������ -- `2px`, `0.5em`, `8` � �.�.
- `color` / ���� -- `#f00`, `green`, `rgb(0,0,0)` � �.�.
- `join`  / ��� ���������� -- `miter`, `bevel`, `round`.
- `cap`   / ��� ���������� -- `butt`, `square`, `round`.
- `dash`  / ������� -- `[1,2,2]`, `shortdash`, `shortdot`, `shortdashdot`, `shortdashdotdot`, `dot`, `dash`, `longdash`, `dashdot`, `longdashdot`, `longdashdotdot`.
- ������������ -- `0.5`, `.3` -- ������ ������ float, ����������� ������ � ��������� ��������, ����������� ����� �� (������� ��� �������� -- ��������, `green 0.5`).
```js
rect.stroke('0.5em round square [1,2] green 0.5');
```
� ��� ����� ���:
```js
rect.stroke({ color:'black', width:'4px', cap:'butt', join:'round', dash:'dot' });
```

#### opacity([value])
���������� / ������������� ������������ (����� �� 0 �� 1).

#### composite([value])
���������� / ������������� ������� ���������. ��������: `source-over`, `source-atop`, `source-in`, `source-out`, `destination-over`, `destination-atop`, `destination-in`, `destination-out`, `lighter`, `darker`, `copy`, `xor`.

��������� �������� ������������ ������� ������ (`normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`), � ����� ������ ��� ��������: http://dev.w3.org/fxtf/compositing-1

#### hide() / show()
������ ������� ������� (`show`) ��� ��������� (`hide`). ��� �������� � �.�. ����� ����, ��������� ������� �� ��������� �� ������� (� ������� �� ��������� �����������).

#### cursor(value)
```js
rect.cursor('pointer');
```
������������� ������ ��� ��������� �� �������. *(���� �������� �� ������ ���������)*

#### z([value])
���������� z-index ��������, ���� �������������.

Z-index � ������� Graphics2D -- ��� ������ ������ �������� (�, ��������������, � ����� �� ����� ��������������):
```js
var a = ctx.rect(10, 10, 200, 200);
var b = ctx.circle(100, 100, 50);
a.z(); // -> 0
b.z(); // -> 1

b.z(0);
b.z(); // -> 0
a.z(); // -> 1
```

#### isPointIn(x, y)
���������� `true`, ���� ����� `(x; y)` ��������� ������ �������.

#### bounds
���������� ������������� (�������) �������. �������� ���������� ����� ������� ����� (`x`, `y` / `x1`, `y1`), ������ ������ (`x2`, `y2`), ������ � ������ (`width`, `height` / `w`, `h`), ���������� ������ (`cx`, `cy`).

### �������
������� `on(event, func)`, `off(event, [func])`, `fire(event, [object])`, � ����� ������ `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`, `mousewheel`, `focus`, `blur` �������� ��������� ���������� ��������������� �������� ���������, �� � ������ ���� �� ��������� � ����������.

### �������������
��� ������������� (����� `translate`) ��������� �������� `pivot` -- ����� ������������� (��������, � ������ � `rotate` -- ������ ����� ����� ���������� ��������). ����� �������� ��� ���������� ���������� (`[0,0]`, `{x:10, y:10}`), ��� � ���� �� ����� ������: `left`, `right`, `top`, `bottom`, `left top` / `top left` / `lt` / `tl` � �.�.

�� ��������� ����� -- ����� ������.
#### scale
```js
rect.scale(2);
rect.scale(0.5, 0.5);
rect.scale(2, 'left top');
rect.scale(0.5, 0.5, 'center');
```
����������� ������, ����� �������� ��� �� x,y ������ �������, ��� � ����������.

#### rotate
```js
rect.rotate(45);
rect.rotate(10, 'left');
```
������������ ������, ����������� ������� (����� ��������� ������� � ������� ��� `degree / 180 * Math.PI`, � ��������� �������� `rad / Math.PI * 180`).

#### skew
```js
rect.skew(10, 0);
rect.skew(5);
rect.skew(-10, 0, 'left');
rect.skew(-5, 'top');
```
"��������" ������. ����������� �������.

#### translate(x, y)
```js
rect.translate(10, 10);
```
�������� ������ �� ���� ���������. �������, ����� �� ��-������� ���������������� ������, � �� ��������� ��� ���������, � ������� ��������� � ��������� ���� ��� ������� ����������� ���������.

#### transform
```js
rect.transform(2, 0, 0, 1.5, 0, 0); // ������ ������
rect.transform(0.5, 0, 0, 0.75, 0, 0, 'top');
```
�������������� ������. ��� ��� ��������, ��������� �����: http://www.intuit.ru/studies/courses/1063/210/lecture/5434?page=5

### ��������
������� `animate`:
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
����� �� �� �������. ��������� ��������� ��� ������������:
- `opacity`
- `fill` (��� ��������� ���������� � �������)
- `stroke` (������ ���� � ������)
- `crop` -- ��� �����������
- `x`, `y`, `width`, `height`, `cx`, `cy`, `radius` -- ��������� �����
- `rotate`, `scale`, `scaleX`, `scaleY`, `skew`, `skewX`, `skewY`, `translate`, `translateX`, `translateY` -- �������������. ��� ������ ������ ������ ������, ��-������� ���� �����. ��� ���: `skew:[10,3]` ������ ������ (���� ���), ����� ���: `skewX:10, skewY:3`.

����� �������� ����...