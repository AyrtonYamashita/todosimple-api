package com.ayrtonyamashita.todosimple.services;

import java.util.List;
import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ayrtonyamashita.todosimple.models.Task;
import com.ayrtonyamashita.todosimple.models.User;
import com.ayrtonyamashita.todosimple.models.enums.ProfileEnum;
import com.ayrtonyamashita.todosimple.models.projection.TaskProjection;
import com.ayrtonyamashita.todosimple.repositories.TaskRepository;
import com.ayrtonyamashita.todosimple.security.UserSpringSecurity;
import com.ayrtonyamashita.todosimple.services.exceptions.AuthorizationException;
import com.ayrtonyamashita.todosimple.services.exceptions.DataBindingViolationException;
import com.ayrtonyamashita.todosimple.services.exceptions.ObjectNotFoundException;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    public Task findById(Long id) {
        Task task = this.taskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException(
                "Tarefa não encontrada! Id: " + id + ", Tipo: " + Task.class.getName()));

        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity)
                || !userSpringSecurity.hasRole(ProfileEnum.ADMIN) && !userHasTask(userSpringSecurity, task))
            throw new AuthorizationException("Acesso negado!");
        return task;
    }

    public List<TaskProjection> findAllbyUser() {
        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");
        List<TaskProjection> tasks = this.taskRepository.findByUser_Id(userSpringSecurity.getId());

        return tasks;
    }

    @Transactional
    public Task create(Task obj) {

        UserSpringSecurity userSpringSecurity = UserService.authenticated();
        if (Objects.isNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");
        User user = this.userService.findById(userSpringSecurity.getId());
        obj.setId(null);
        obj.setUser(user);
        obj = this.taskRepository.save(obj);

        return obj;
    }

    @Transactional
    public Task update(Task obj) {
        Task newObj = findById(obj.getId());
        newObj.setDescription(obj.getDescription());

        return this.taskRepository.save(newObj);
    }

    @Transactional
    public void delete(Long id) {
        findById(id);
        try {
            this.taskRepository.deleteById(id);
        } catch (Exception e) {
            throw new DataBindingViolationException("Não é possível deletar pois há entidades relacionadas!");
        }
    }

    public Boolean userHasTask(UserSpringSecurity userSpringSecurity, Task task) {
        return task.getUser().getId().equals(userSpringSecurity.getId());
    }

}
