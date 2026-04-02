package com.Se2.CyberWebApp.service;

import com.Se2.CyberWebApp.entity.Role;
import com.Se2.CyberWebApp.entity.User;
import com.Se2.CyberWebApp.repository.RoleRepository;
import com.Se2.CyberWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void banUser(Integer id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(false);
            userRepository.save(user);
        });
    }

    public void unbanUser(Integer id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setEnabled(true);
            userRepository.save(user);
        });
    }

    public void updatePassword(Integer id, String newPassword) {
        userRepository.findById(id).ifPresent(user -> {
            user.setPasswordHash(newPassword);
            userRepository.save(user);
        });
    }

    public void adjustCoins(Integer id, Integer amount) {
        userRepository.findById(id).ifPresent(user -> {
            user.setCoin((user.getCoin() == null ? 0 : user.getCoin()) + amount);
            userRepository.save(user);
        });
    }

    public void updateUserRole(Integer id, String roleName) {
        Optional<User> userOpt = userRepository.findById(id);
        Optional<Role> roleOpt = roleRepository.findByName(roleName);

        if (userOpt.isPresent() && roleOpt.isPresent()) {
            User user = userOpt.get();
            user.setRoleEntity(roleOpt.get());
            userRepository.save(user);
        }
    }
}
