'use strict';

const app = angular.module("App", ["ngMaterial"]).config(function ($mdThemingProvider) {
  $mdThemingProvider.theme("default").primaryPalette("teal", {
    'default': 'A400' // by default use shade 400 from the pink palette for primary intentions

  }).accentPalette("orange");
});
let currentPosition = 0;
const positions = [{
  top: 100,
  left: 100
}, {
  top: 135,
  left: 205
}, {
  top: 240,
  left: 170
}, {
  top: 205,
  left: 65
}];

const AddNewDomino = (top, left, point) => {
  const domino = [];
  const square = new fabric.Rect({
    top: top,
    left: left,
    width: 70,
    height: 70,
    strokeWidth: 1,
    stroke: 'gray',
    fill: 'transparent'
  });
  domino.push(square);

  if (point % 2 === 1) {
    domino.push(new fabric.Circle({
      top: top + 28,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 27,
      strokeWidth: 3
    }));
  }

  if (point >= 2) {
    domino.push(new fabric.Circle({
      top: top + 7,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 51,
      strokeWidth: 3
    }));
    domino.push(new fabric.Circle({
      top: top + 50,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 5,
      strokeWidth: 3
    }));
  }

  if (point >= 4) {
    domino.push(new fabric.Circle({
      top: top + 7,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 5,
      strokeWidth: 3
    }));
    domino.push(new fabric.Circle({
      top: top + 50,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 51,
      strokeWidth: 3
    }));
  }

  if (point === 6) {
    domino.push(new fabric.Circle({
      top: top + 28,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 5,
      strokeWidth: 3
    }));
    domino.push(new fabric.Circle({
      top: top + 28,
      radius: 6,
      fill: 'rgb(29,233,182)',
      left: left + 51,
      strokeWidth: 3
    }));
  }

  return new fabric.Group(domino);
};

const showAllDomino = (canvas, $scope) => {
  const groups = [];

  for (let index = 0; index < 7; index++) {
    groups.push({
      domino: AddNewDomino(100, index * 100, index + 1),
      position: "Top",
      point: index + 1
    });
    groups.push({
      domino: AddNewDomino(170, index * 100, index + 1),
      position: "Bottom",
      point: index + 1
    });
  }

  for (let index = 0; index < groups.length; index++) {
    canvas.add(groups[index].domino);
  }

  return groups;
};

app.controller("DominoController", $scope => {
  const currentDomino = new fabric.StaticCanvas('currentDomino');
  const newDomino = new fabric.StaticCanvas('newDomino');
  let dominos = [];
  let mainDominoGroupPart1 = AddNewDomino(100, 100, 1);
  let mainDominoGroupPart2 = AddNewDomino(170, 100, 1);
  let mainDominoGroup = new fabric.Group([mainDominoGroupPart1, mainDominoGroupPart2]);

  $scope.clearNewDomain = () => {
    for (let index = 0; index < dominos.length; index++) {
      newDomino.remove(dominos[index].domino);
    }

    dominos = [];
  };

  fabric.util.addListener(currentDomino.lowerCanvasEl, "mousedown", options => {
    if (dominos.length === 0 && options.layerX > mainDominoGroup.left && options.layerY > mainDominoGroup.top && options.layerX < mainDominoGroup.left + mainDominoGroup.width && options.layerY < mainDominoGroup.top + mainDominoGroup.height) {
      dominos = showAllDomino(newDomino, $scope);
    } else {
      $scope.clearNewDomain();
    }
  });
  currentDomino.add(mainDominoGroup);

  $scope.newDomino = () => {
    if (dominos.length == 0) {
      dominos = showAllDomino(newDomino, $scope);
    } else {
      $scope.clearNewDomain();
    }
  };

  $scope.left = () => {
    currentPosition = currentPosition - 1 < 0 ? 3 : currentPosition - 1;
    mainDominoGroup.animate('angle', '-=90', {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
    mainDominoGroup.animate('left', positions[currentPosition].left, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
    mainDominoGroup.animate('top', positions[currentPosition].top, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
  };

  $scope.right = () => {
    currentPosition = (currentPosition + 1) % 4;
    mainDominoGroup.animate('angle', '+=90', {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
    mainDominoGroup.animate('left', positions[currentPosition].left, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
    mainDominoGroup.animate('top', positions[currentPosition].top, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
  };

  $scope.scale = 1;
  $scope.duration = 500;
  $scope.$watch(() => {
    return $scope.scale;
  }, (newValue, oldValue) => {
    mainDominoGroup.animate('scaleX', newValue, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
    mainDominoGroup.animate('scaleY', newValue, {
      onChange: currentDomino.renderAll.bind(currentDomino),
      duration: $scope.duration
    });
  });
  fabric.util.addListener(newDomino.lowerCanvasEl, "mousedown", options => {
    for (let index = 0; index < dominos.length; index++) {
      if (options.layerX > dominos[index].domino.left && options.layerY > dominos[index].domino.top && options.layerX < dominos[index].domino.left + dominos[index].domino.width && options.layerY < dominos[index].domino.top + dominos[index].domino.height) {
        $scope.changeDomino({
          position: dominos[index].position,
          point: dominos[index].point
        });
      }
    }
  });

  $scope.changeDomino = data => {
    if (data.position == "Top") {
      currentDomino.remove(mainDominoGroup);
      mainDominoGroupPart1 = AddNewDomino(100, 100, data.point);
      mainDominoGroupPart2.top = 170;
      mainDominoGroupPart2.left = 100;
      mainDominoGroup = new fabric.Group([mainDominoGroupPart1, mainDominoGroupPart2]);
      currentDomino.add(mainDominoGroup);
    }

    if (data.position == "Bottom") {
      currentDomino.remove(mainDominoGroup);
      mainDominoGroupPart2 = AddNewDomino(170, 100, data.point);
      mainDominoGroupPart1.top = 100;
      mainDominoGroupPart1.left = 100;
      mainDominoGroup = new fabric.Group([mainDominoGroupPart1, mainDominoGroupPart2]);
      currentDomino.add(mainDominoGroup);
    }
  };
});