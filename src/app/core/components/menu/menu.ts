import { Menu } from './menu.model';
/**
 * @description All possible menu options
 */
export const verticalMenuItems = [
    // menu format ==>
    // new Menu(id: number, title: string, routerLink: string | null, href: string | null,
    // icon: string, target: string | null, hasSubMenu: boolean, parentId: number, 
    // show: boolean, privacy: string, forum?: string | undefined)

    new Menu(1, 'Subscribers', '/subscribers', null, 'people', null, false, 0, true, 'admin'),

    new Menu(2, 'Sub Menu Test', null, null, 'dynamic_form', null, true, 0, true, 'admin'),
    new Menu(21, 'Sub Menu', '/test/test-list', null, 'donut_small', null, false, 2, true, 'admin'),
];
