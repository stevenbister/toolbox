import { useId, type ComponentPropsWithoutRef } from 'react';
import { classList } from '../../../../utils/src/class-list/class-list';
import styles from './table.module.css';

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
    caption: string;
}

export const Table = ({ children, caption, ...rest }: TableProps) => {
    const captionId = useId();

    return (
        <div
            className={styles.container}
            tabIndex={0}
            role="region"
            aria-labelledby={captionId}
        >
            <table
                {...rest}
                className={classList(styles.table, rest.className)}
            >
                <caption id={captionId} className={styles.caption}>
                    {caption}
                </caption>

                {children}
            </table>
        </div>
    );
};

/* -------------------------------------------------------------------------------------------------
 * THead
 * -----------------------------------------------------------------------------------------------*/
interface TheadProps extends ComponentPropsWithoutRef<'thead'> {}

const Thead = ({ children, ...rest }: TheadProps) => (
    <thead {...rest} className={classList(styles.thead, rest.className)}>
        {children}
    </thead>
);

/* -------------------------------------------------------------------------------------------------
 * Tbody
 * -----------------------------------------------------------------------------------------------*/
interface TbodyProps extends ComponentPropsWithoutRef<'tbody'> {}

const Tbody = ({ children, ...rest }: TbodyProps) => (
    <tbody {...rest} className={classList(styles.tbody, rest.className)}>
        {children}
    </tbody>
);

/* -------------------------------------------------------------------------------------------------
 * Tfoot
 * -----------------------------------------------------------------------------------------------*/
interface TfootProps extends ComponentPropsWithoutRef<'tfoot'> {}

const Tfoot = ({ children, ...rest }: TfootProps) => (
    <tfoot {...rest} className={classList(styles.tfoot, rest.className)}>
        {children}
    </tfoot>
);

/* -------------------------------------------------------------------------------------------------
 * Tr
 * -----------------------------------------------------------------------------------------------*/
interface TrProps extends ComponentPropsWithoutRef<'tr'> {}

const Tr = ({ children, ...rest }: TrProps) => (
    <tr {...rest} className={classList(styles.tr, rest.className)}>
        {children}
    </tr>
);

/* -------------------------------------------------------------------------------------------------
 * Th
 * -----------------------------------------------------------------------------------------------*/
interface ThProps extends ComponentPropsWithoutRef<'th'> {}

const Th = ({ children, ...rest }: ThProps) => (
    <th {...rest} className={classList(styles.th, rest.className)}>
        {children}
    </th>
);

/* -------------------------------------------------------------------------------------------------
 * TD
 * -----------------------------------------------------------------------------------------------*/
interface TdProps extends ComponentPropsWithoutRef<'td'> {}

const Td = ({ children, ...rest }: TdProps) => (
    <td {...rest} className={classList(styles.td, rest.className)}>
        {children}
    </td>
);

Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Tfoot = Tfoot;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;
