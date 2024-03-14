import type { OptionsType } from "@/components/ReSegmented";

const menuTypeOptions: Array<OptionsType> = [
  {
    label: "菜单",
    value: 0
  },
  {
    label: "iframe",
    value: 1
  },
  {
    label: "外链",
    value: 2
  },
  {
    label: "按钮",
    value: 3
  }
];

const showLinkOptions: Array<OptionsType> = [
  {
    label: "隐藏",
    tip: "不会在菜单中显示",
    value: false
  },
  {
    label: "显示",
    tip: "会在菜单中显示",
    value: true
  }
];

const keepAliveOptions: Array<OptionsType> = [
  {
    label: "不缓存",
    tip: "不会保存该页面的整体状态",
    value: false
  },
  {
    label: "缓存",
    tip: "会保存该页面的整体状态，刷新后会清空状态",
    value: true
  }
];

const showParentOptions: Array<OptionsType> = [
  {
    label: "隐藏",
    tip: "不会显示父级菜单",
    value: false
  },
  {
    label: "显示",
    tip: "会显示父级菜单",
    value: true
  }
];

export {
  menuTypeOptions,
  showLinkOptions,
  keepAliveOptions,
  showParentOptions
};
