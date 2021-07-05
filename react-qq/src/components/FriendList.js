import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PullToRefresh, SwipeAction } from 'antd-mobile';

class FriendList extends Component {
    state = {
        down: false,
        height: document.documentElement.clientHeight,
        refreshing: false
    }

    render() {
        let newFriendList = [...this.props.friendList];
        newFriendList.sort((a, b)=>b.isTop-a.isTop);

        return (
            <PullToRefresh
                damping={60}
                ref={el => this.ptr = el}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
                direction={this.state.down ? 'down' : 'up'}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                    this.setState({ refreshing: true });
                    setTimeout(() => {
                        this.setState({ refreshing: false });
                    }, 1000);
                }}
            >{
                newFriendList.map(item => {
                    return <SwipeAction key={item.id} right={[
                        {
                            text: item.isTop?'取消置顶':'置顶',
                            onPress: () => this.props.changeTop(item.id),
                            style: { backgroundColor: '#ddd', color: 'white' },
                        },
                        {
                            text: item.isRead?'标为未读': '标为已读',
                            onPress: () => this.props.changeRead(item.id),
                            style: { backgroundColor: '#F4333C', color: 'white' },
                        },
                        {
                            text: '删除',
                            onPress: () => console.log('delete'),
                            style: { backgroundColor: '#F4333C', color: 'white' },
                        },
                    ]}>
                        <li className="friend" style={{background: item.isTop?'#ccc': '#fff'}}>
                            <p>
                                <span>{item.name}</span>
                                <span>{item.lastTime}</span>
                            </p>
                            {!item.isRead && <span>{item.unRead}</span>}
                        </li>
                    </SwipeAction>

                })
            }</PullToRefresh>
        )
    }
}
const mapStateToProps = state => {
    return {
        friendList: state.friendList
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        changeRead: payload=>{
            dispatch({
                type: 'CHANGE_READ',
                payload
            })
        },
        changeTop: payload=>{
            dispatch({
                type: 'CHANGE_TOP',
                payload
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FriendList)