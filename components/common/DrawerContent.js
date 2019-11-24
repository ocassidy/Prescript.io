import { View } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';

export const DrawerContent = props => (
    <ScrollView>
        <View
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems
                activeBackgroundColor={'black'}
                activeTintColor={'white'}
                {...props} />
        </View>
    </ScrollView>
);