Graphics2D.Context
===================

`Graphics2D.Context` -- ��� ���� ����������� �������� ����������, ������� ����� �������� ���:
```js
var ctx = Graphics2D.id('element'); // canvas � id element
var ctx = Graphics2D.query('canvas', 0); // ������ canvas �� ��������
// ����� �������� � ��� �������
var ctx = Graphics2D.query( document.getElementById('foo') );
```

### ������
��� ������ ���������� ��� ��������, ���� �� ��������� �����.

#### update
```js
ctx.update();
```
��������� �����. ���������, ���� �� ������� ������ �������� ���������� ��������� �������� � �.�.

#### getObjectInPoint(x, y)
```js
ctx.getObjectInPoint(10, 10);
```
���������� ������, ����������� � ����� `(x; y)`. �� ��������� ��������� ������� -- � ��� ������ ������� ������� `hide`. ��� ��������� (��������� ����������, �������� ������� � ������� � �.�.) �����������.

#### on(event, func)
```js
ctx.on('click', function(e){
  e.targetObject.fill('red');
  x = e.contextX;
  y = e.contextY;
});
```
������ ���������� ������� �� �����. ������ �������, ��������� ������ `event` (���������� `e` � �������) 3 ����������:
- `targetObject` - �� ����� ������� ������ ��������� ����.
- `contextX`, `contextY` - ���������� ���� �� ������.

#### off(event, [func])
```js
ctx.on('click', anyfunc);
ctx.off('click', anyfunc);
ctx.off('click');
```
������� ���������� ������� � ������.

#### fire(event, [object])
```js
ctx.on('click', function(data){ console.log(data.text); });
ctx.fire('click', {text:'anytext'});
```
��������� ��� ������������� ����������� �������.

### ������
```js
ctx.click(function(){ console.log(3); });
ctx.click(); // = fire('click');
```
`click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`, `mousewheel`, `focus`, `blur` -- ��� ��������� ������.

### ��������
```js
ctx.rect(10, 10, 200, 200, 'black');
```
��������� ������� ����� ��������� � ������� ������� ���������, ������ ��� ���� ����� �������� ����� ����������� � ����� ��������.

���� �� ��� ��� ������: `rect`, `circle`, `path`, `image`, `text`, `textblock`, `gradient`, `pattern`.