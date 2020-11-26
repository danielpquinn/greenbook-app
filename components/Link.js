import React from 'react';
import { default as NextLink } from "next/link";
import { useStateValue } from "../components/State";
import { Text, StyleSheet, Button, View, TouchableOpacity, Linking } from 'react-native';
import { getStyles, Theme } from '../utils';

export function Link(props) {

    const [{ view, isWeb }, dispatch] = useStateValue();
    const external = props.href.slice(0,1) !== '/';

    const handleURL = (e) => {
        if (!external) {
            dispatch({type: 'setView', view: props.href || ''})
        }
    }
    const handleURLFully = (e) => {
        if (!external) {
            dispatch({type: 'setView', view: props.as ? props.as : props.href})
        } else {
            Linking.openURL(props.href || '')
        }

        if(!isWeb && props.to) {
            // This for navigating to Searching using map in the home page
            if(props.abbr && props.city) {
                dispatch({type: 'searchConfig', value: { q: "", near: `${props.city}, ${props.abbr}`}});
            }
      
            props.navigation.navigate(props.to, { screen: props.routeName ? props.routeName : '', ...props.params });
        }
    }
    let webProps = isWeb && props.download ? {download: props.download} : {};

    if (props.button) {
        const styles = StyleSheet.create(getStyles(props.button + ', ' + props.button + '_text', {isWeb}));
        return isWeb
            ? <NextLink href={props.href || ''} as={props.as || ''}> 
                <a target={external ? '_blank' : ''} style={{textDecoration: 'none'}}>
                    <View style={[{flexDirection: 'row', cursor: 'pointer'}, props.style ? props.style : {}]}>
                        <View style={styles[props.button]}>
                            <Text style={styles[props.button + '_text']}>{props.title}</Text>
                        </View>
                    </View>
                </a>
                </NextLink>
            : <TouchableOpacity onPress={handleURLFully}>
                    <View style={[{flexDirection: 'row'}, props.style ? props.style : {}]}>
                        <View style={styles[props.button]}>
                            <Text style={styles[props.button + '_text']}>{props.title || ''}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
    } else if (props.children) {
        let more = props.fill ? {height: '100%'} : {}

        return isWeb 
            ? <NextLink href={props.href || ''} as={props.as || ''}><a target={external ? '_blank' : ''} {...webProps}  style={{...props.style, textDecoration: 'none', ...more}}>{props.children}</a></NextLink> 
            : <TouchableOpacity onPress={(handleURLFully)}><View>{props.children}</View></TouchableOpacity>
    }

    return (
        isWeb 
        ? <NextLink href={props.href || ''}> <a onClick={handleURLFully} {...webProps}>{props.title}</a> </NextLink>
        : <Button title={props.title || ''} color={Theme.green} onPress={handleURLFully} {...props} />
    )

}

export function Click(url, config) {
    const [{ view, isWeb }, dispatch] = useStateValue();
    if (isWeb) {
        window.location = url;
    } else {
        dispatch({type: 'setView', view: url || ''})
    }
    return
}

