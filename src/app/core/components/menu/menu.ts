import { Menu } from './menu.model';
/**
 * @description All possible menu options
 */
export const verticalMenuItems = [
    // menu format ==>
    // new Menu(id: number, title: string, routerLink: string | null, href: string | null,
    // icon: string, target: string | null, hasSubMenu: boolean, parentId: number, 
    // show: boolean, privacy: string, forum?: string | undefined)

    new Menu(1, 'Vendors', '/vendors', null, 'engineering', null, false, 0, true, 'admin'),

    new Menu(4, 'Customer', '/customers', null, 'people', null, false, 0, true, 'admin'),

    new Menu(5, 'Sub Menu Test', null, null, 'dynamic_form', null, true, 0, true, 'admin'),
    new Menu(51, 'Sub Menu', '/test/test-list', null, 'donut_small', null, false, 5, true, 'admin'),
];
