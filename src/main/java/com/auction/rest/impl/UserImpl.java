package com.auction.rest.impl;


import com.auction.rest.dao.impl.user.UserDaoService;
import com.auction.rest.exception.AuctionException;
import com.auction.rest.model.Id;
import com.auction.rest.model.User;

public class UserImpl {
    UserDaoService userDaoService;

    public UserImpl(UserDaoService userDaoService) {
        this.userDaoService = userDaoService;
    }

    public Id addUser(User user) throws AuctionException {
        Long id = this.userDaoService.addUser(user);
        return new Id(id);
    }

    public User getUser(Long id) throws AuctionException {
        User user = this.userDaoService.getUser(id);
        return user;
    }
}
