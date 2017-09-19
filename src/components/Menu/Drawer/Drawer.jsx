import React, { PureComponent } from 'react';
import styles from './styles.scss';

export default class Drawer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      handleRightClose,
      isDrawerOpen,
    } = this.props;

    return (
      <div
        className={[
          styles['container'],
          isDrawerOpen ? styles['nav-drawer_open'] : '',
        ].join(' ')
        }
      >
        <div
          className={styles['drawer-overlay']}
          onClick={handleRightClose}
        >
        </div>
        <section className={styles['drawer']}>
          <main className={styles['content']}>
            <header>
              <nav>
                {this.props.children}
              </nav>
            </header>
          </main>
        </section>
      </div>
    );
  }
}
